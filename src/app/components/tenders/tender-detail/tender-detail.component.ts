import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { GenericApiResponse, Tender, UserInfo } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-tender-detail',
  templateUrl: './tender-detail.component.html',
  styleUrls: ['./tender-detail.component.scss']
})
export class TenderDetailComponent implements OnInit {
	tenderId: number;
	tender!: Tender;
	user: UserInfo | null = null;
	message: string = '';
	subscription!: Subscription;
	disableBtn = false;

	constructor(private route: ActivatedRoute, 
				private router: Router,
				private toaster: ToastrService,
				private apiService: ApiService) 
	{
		this.tenderId = +this.route.snapshot.params['tenderId'];
	}

	ngOnInit(): void {
		if (this.tenderId) {
			this.getUserDetails();
		}
	}

	getTenderDetails(): void {
		this.apiService.get(`/tenders/${this.tenderId}`).subscribe({
			next: (resp: GenericApiResponse) => {
				this.tender = resp.data.tender;

				const tenderForBidding = this.user?.bids.find(bid => bid.tenderId === this.tender.tenderId);
				if (tenderForBidding) {
					this.tender.bid = tenderForBidding;
				}

				const t = timer(0, 1000);
				this.subscription = t.subscribe(() => this.setRemainingTime());
			},
			error: (error: any) => this.toaster.error(error)
		});
	}

	getUserDetails(): void {
		this.apiService.get('/users/me').subscribe({
			next: (resp: GenericApiResponse) => {
				this.user = resp.data.user;
				this.getTenderDetails();
			},
			error: (error: any) => this.toaster.error(error)
		});
	}

	setRemainingTime() {
		const currentTime = new Date().getTime();

		// Case: If tender closing time passed away (Tender Finished)
		if ((new Date(this.tender.closingDate).getTime() - currentTime) < 0) {
			this.tender.remainingTime = 0;
			this.subscription.unsubscribe();
			return;
		}
		
		const lastTenMinutes = moment(this.tender.closingDate).subtract(10, 'minutes');

		// Case: If Current time is in between Opening and Closing time of tender
		if (new Date(this.tender.openingDate).getTime() < currentTime) {
			// Check if tender is in last 10 minutes
			if (!moment(lastTenMinutes).isSameOrAfter(currentTime)) 
			{
				this.tender.canBid = true;
			}

			const diff = new Date(this.tender.closingDate).getTime() - currentTime;
			const days = Math.floor(diff / (60 * 60 * 24 * 1000));
			const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
			const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
			const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
	
			this.tender.remainingTime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
		}
		else {
			// Case: If Opening time of tender is ahead of current time
			this.tender.remainingTime = -1;
		}
	}

	onParticipate(tender: Tender): void {
		this.disableBtn = true;
		const currentTime = new Date().getTime();
		const lastTenMinutes = moment(tender.closingDate).subtract(10, 'minutes');

		if (moment(lastTenMinutes).isSameOrAfter(currentTime)) 
		{
			const payload = {
				tenderId: this.tender.tenderId,
				userId: this.user?.userId
			};

			this.apiService.post('/bids', payload).subscribe({
				next: (resp: GenericApiResponse) => {
					this.disableBtn = false;
					this.message = 'Thank you, your request has been submitted. You will be notified by email when bidding time arrives.'
					tender.bid = resp.data.bid;
				},
				error: (error) => {
					this.toaster.error(error);
					this.disableBtn = false;
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
