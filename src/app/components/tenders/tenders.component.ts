import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subscription, timer } from 'rxjs';

import { GenericApiResponse, Tender, UserInfo } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit, OnDestroy {
	tenders: Tender[] = [];
	user: UserInfo | null = null;

	subscriptions: Subscription[] = [];
	disableBtn = false;
	searchFC = new FormControl();
	message: string = '';

	constructor(private apiService: ApiService,
				private authService: AuthService,
				private router: Router,
				private toaster: ToastrService) 
	{
		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(search => {
				this.getTenders(search);
			});
	}

	ngOnInit(): void {
		// Get user details so that we get user bidding details that been already done.
		this.getUserDetails();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subs => subs.unsubscribe());
	}

	getUserDetails(): void {
		this.apiService.get('/users/me').subscribe({
			next: (resp: GenericApiResponse) => {
				this.user = resp.data.user;
				this.getTenders();
			},
			error: (error: any) => this.toaster.error(error)
		});
	}

	getTenders(search: string | null = null): void {
		const slug = search ? `/tenders?tenderNumbeer=${search}` : '/tenders';

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => {
				this.tenders = resp.data.tenders;

				for (let tender of this.tenders) 
				{
					const tenderForBidding = this.user?.bids.find(bid => bid.tenderId === tender.tenderId);
					if (tenderForBidding) {
						tender.bid = tenderForBidding;
					}

					const t = timer(0, 1000);
					const subs = t.subscribe(() => this.setRemainingTime(tender, subs));
					this.subscriptions.push(subs);
				}
			},
			error: (error: any) => this.toaster.error(error)
		});
	}

	setRemainingTime(tender: Tender, subs: Subscription) {
		const currentTime = new Date().getTime();

		// Case: If tender closing time passed away (Tender Finished)
		if ((new Date(tender.closingDate).getTime() - currentTime) < 0) {
			tender.remainingTime = 0;
			subs.unsubscribe();
			return;
		}
		
		const lastTenMinutes = moment(tender.closingDate).subtract(10, 'minutes');

		// Case: If Current time is in between Opening and Closing time of tender
		if (new Date(tender.openingDate).getTime() < currentTime) {
			// Check if tender is in last 10 minutes
			if (!moment(lastTenMinutes).isSameOrAfter(currentTime)) 
			{
				tender.canBid = true;
			}

			const diff = new Date(tender.closingDate).getTime() - currentTime;
			const days = Math.floor(diff / (60 * 60 * 24 * 1000));
			const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
			const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
			const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
	
			tender.remainingTime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		}
		else {
			// Case: If Opening time of tender is ahead of current time
			tender.remainingTime = -1;
		}
	}

	onParticipate(tender: Tender): void {
		const currentTime = new Date().getTime();
		const lastTenMinutes = moment(tender.closingDate).subtract(10, 'minutes');

		if (moment(lastTenMinutes).isSameOrAfter(currentTime)) 
		{
			for (let t of this.tenders) t.submitting = false;
			tender.submitting = true;

			const payload = {
				tenderId: tender.tenderId,
				userId: this.user?.userId
			};

			this.apiService.post('/bids', payload).subscribe({
				next: (resp: GenericApiResponse) => {
					tender.submitting = false;
					this.message = 'Thank you, your request has been submitted. You will notified by email when bidding time arrives.'
					tender.bid = resp.data.bid;
				},
				error: (error) => {
					this.toaster.error(error);
					tender.submitting = false;
				}
			});
		}
		else {
			const tenderId = tender.tenderId;
			const biddingId = tender?.bid?.biddingId;
			this.router.navigate(['/bidding', { tenderId, biddingId }]);
		}
	}

	onViewPricing(tender: Tender): void {
		this.router.navigateByUrl(`pricing/${tender.tenderId}`);
	}
}
