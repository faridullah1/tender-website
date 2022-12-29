import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

	constructor(private apiService: ApiService,
				private authService: AuthService,
				private toaster: ToastrService) 
	{
		this.authService.userInfo.subscribe(userInfo => {
			this.user = userInfo;
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

				for (let tender of this.tenders) {
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

		if ((new Date(tender.closingDate).getTime() - currentTime) < 0) {
			tender.remainingTime = 0;
			subs.unsubscribe();
			return;
		}
		
		const diff = new Date(tender.closingDate).getTime() - currentTime;
		const days = Math.floor(diff / (60 * 60 * 24 * 1000));
		const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
		const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
		const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

		tender.remainingTime = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}

	onParticipate(tender: Tender): void {
		console.log('Participating in tender =', tender);
	}
}
