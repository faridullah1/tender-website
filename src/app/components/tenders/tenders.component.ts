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
	searchFC = new FormControl();
	user: UserInfo | null = null;

	subscriptions: Subscription[] = [];
	disableBtn = false;
	message: string = '';
	userBiddingTenders: number[] = []; 

	constructor(private apiService: ApiService,
				private authService: AuthService,
				private router: Router,
				private toaster: ToastrService) 
	{
		this.authService.userInfo.subscribe(userInfo => {
			this.user = userInfo;
			if (this.user && this.user.tenders) {
				this.userBiddingTenders = this.user.tenders.map(bid => bid.tenderId) || [];
			}
		});

		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(search => {
				this.getTenders(search);
			});
	}

	ngOnInit(): void {
		this.getTenders();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subs => subs.unsubscribe());
	}

	getTenders(search: string | null = null): void {
		const slug = search ? `/tenders?tenderNumbeer=${search}` : '/tenders';

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => {
				this.tenders = resp.data.tenders;

				for (let tender of this.tenders) 
				{
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
		
		// Case: If Current time is in between Opening and Closing time of tender
		if (new Date(tender.openingDate).getTime() < currentTime) {
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
				next: () => {
					tender.submitting = false;
					this.message = 'Thank you, your request has been submitted. You will notified by email when bidding time arrives.'
					this.getTenders();
				},
				error: (error) => {
					this.toaster.error(error);
					tender.submitting = false;
				}
			});
		}
		else {
			this.router.navigate(['/bidding', {tenderId: tender.tenderId}]);
		}
	}
}
