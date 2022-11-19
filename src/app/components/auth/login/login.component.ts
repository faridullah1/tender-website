import { Router, ActivatedRoute } from '@angular/router';
import { GenericApiResponse, LoginAccountType } from './../../../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


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
				private apiService: ApiService,
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
		this.apiService.post('/login', this.theForm.value).subscribe({
			next: (resp: GenericApiResponse) => this.router.navigateByUrl('/projects'),
			error: (error: any) => this.disableLoginBtn = false
		});
	}
}
