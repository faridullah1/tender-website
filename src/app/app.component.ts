import { UserInfo } from './models';
import { GenericApiResponse } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  	title = 'Wissal';

	constructor(private apiService: ApiService, private authService: AuthService) { }

	ngOnInit(): void {
		const token = localStorage.getItem('token');
		if (token) {
			this.getUserDetails();
		}
	}

	getUserDetails(): void {
		this.apiService.get('/users/me').subscribe({
			next: (resp: GenericApiResponse) => {
				const user: UserInfo = resp.data.user;
				this.authService.setUserInfo(user);
			}
		})
	}
}
