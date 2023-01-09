import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { GenericApiResponse, UserInfo, UserNotification } from 'src/app/models';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	notifications: UserNotification[] = [];
	user: UserInfo | null = null;
	searchFC = new FormControl();

	constructor(private apiService: ApiService,
				private authService: AuthService,
				private toaster: ToastrService) 
	{
		this.searchFC.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
			.subscribe(search => {
				this.getNotifications(search);
			});

		this.authService.userInfo.subscribe(userInfo => {
			this.user = userInfo;
		});
	}

	ngOnInit(): void {
		this.getNotifications();
	}

	getNotifications(search: string | null = null): void {
		const slug = search ? `/notifications?type=${search}` : `/notifications?userId=${this.user?.userId}`;

		this.apiService.get(slug).subscribe({
			next: (resp: GenericApiResponse) => this.notifications = resp.data.notifications,
			error: (error: any) => this.toaster.error(error)
		});
	}
}
