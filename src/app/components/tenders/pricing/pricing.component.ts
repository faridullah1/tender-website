import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';
import { Bid } from './../../../models';
import { GenericApiResponse } from 'src/app/models';


@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
	tenderId!: number;
	bids: Bid[] = [];

	constructor(private route: ActivatedRoute,
				private toaster: ToastrService,
				private apiService: ApiService) 
	{ }

	ngOnInit(): void {
		this.tenderId = +this.route.snapshot.params['tenderId'];
		this.getAllBids();
	}

	getAllBids(): void {
		this.apiService.get(`/tenders/${this.tenderId}/bids`).subscribe({
			next: (resp: GenericApiResponse) => this.bids = resp.data.bids,
			error: (error: any) => this.toaster.error(error)
		});
	}
}
