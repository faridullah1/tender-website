import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenericApiResponse, Tender } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-tenders',
  templateUrl: './tenders.component.html',
  styleUrls: ['./tenders.component.scss']
})
export class TendersComponent implements OnInit {
	tenders: Tender[] = [];
	searchFC = new FormControl();

	constructor(private apiService: ApiService,
				private toaster: ToastrService) 
	{
		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(search => {
				this.getTenders(search);
			})
	}

	ngOnInit(): void {
		this.getTenders();
	}

	getTenders(search: string | null = null): void {
		const slug = search ? `/tenders?tenderNumbeer=${search}` : '/tenders';

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => this.tenders = resp.data.tenders,
			error: (error: any) => this.toaster.error(error)
		});
	}

	getRemainingTime(tender: Tender): string {
		const diff = new Date(tender.closingDate).getTime() - new Date(tender.openingDate).getTime();
		const days = Math.floor(diff / (60 * 60 * 24 * 1000));
		const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
		const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
		const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

		return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
	}
}
