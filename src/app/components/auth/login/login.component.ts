import { Router, ActivatedRoute } from '@angular/router';
import { GenericApiResponse, LoginAccountType } from './../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	theForm: FormGroup;
	disableLoginBtn = false;
	loginType: LoginAccountType = 'Client';

	constructor(private fb: FormBuilder, 
				private toaster: ToastrService,
				private authService: AuthService,
				private route: ActivatedRoute,
				private router: Router) 
	{
		this.theForm = fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});

		this.loginType = this.route.snapshot.params['type'];
	}

	onLogin(): void {
		this.disableLoginBtn = true;
		this.authService.login(this.theForm.value).subscribe({
			next: (resp: GenericApiResponse) => {
				const token = resp.access_token;
				localStorage.setItem('token', token);
				this.authService.setUserInfo()
				this.router.navigateByUrl('/tenders');
			},
			error: (error: any) => {
				this.disableLoginBtn = false,
				this.toaster.error(error);
			}
		});
	}
}
