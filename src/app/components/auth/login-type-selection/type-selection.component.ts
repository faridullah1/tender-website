import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginType } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'login-type-selection',
  templateUrl: './type-selection.component.html',
  styleUrls: ['./type-selection.component.scss']
})
export class LoginTypeSelectionComponent implements OnInit {
	loginTypes: LoginType[];
	
	constructor(private apiService: ApiService, 
				private router: Router) 
	{
		this.loginTypes = [
			{
				type: 'Client',
				image: '/assets/images/client.svg',
				visible: false
			},
			{
				type: 'Supplier',
				image: '/assets/images/supplier.svg',
				visible: false
			},
			{
				type: 'Contractor',
				image: '/assets/images/supplier.svg',
				visible: false
			},
			{
				type: 'Consultant',
				image: '/assets/images/consultant.svg',
				visible: false
			}
		]
	}

	ngOnInit(): void {
		this.apiService.get('/login').subscribe(resp => {
			console.log(resp);
		});
	}

	onMouseEnter(type: LoginType): void {
		for (let t of this.loginTypes) t.visible = false;

		type.visible = true;
	}

	onMouseLeave(type: LoginType): void {
		for (let t of this.loginTypes) t.visible = false;
	}

	onLogin(type: LoginType): void {
		this.router.navigate(['login', type.type]);
	}

	onCreateNewAccount(type: LoginType): void {
		this.router.navigate(['create-account', type.type]);
	}
}
