import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { GenericApiResponse, LoginAccountType } from './../../../models';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent {
	accountType: LoginAccountType = 'Client';
	isMobileVerfied = false;
	verificationCode!: number;
	theForm: FormGroup;
	disableVerifyBtn = false;

	constructor(private route: ActivatedRoute,
				private router: Router, 
				private apiService: ApiService) 
	{
		this.accountType = route.snapshot.params['type'] as LoginAccountType;

		this.theForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required]),
		});
	}

	numericOnly(ev: any): boolean
    {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
		if (allowedKeys.includes(ev.key)) return true;

        const letters = /^[0-9]+$/;
        if (ev.key && ev.key.match(letters))
        {
            return (ev.key.match(letters).length > 0);
        }

        return false;
    }

	onOTPVerification(): void {
		this.disableVerifyBtn = true;
		const { mobileNumber } = this.theForm.value;
		const payload = { mobileNumber: mobileNumber}

		this.apiService.post('/users/otpVerification', payload).subscribe({
			next: (resp: any) => {
				this.disableVerifyBtn = false;
				this.verificationCode = resp.data.code;
			},
			error: () => this.disableVerifyBtn = false
		});
	}

	onVerify(code: string): void {
		this.isMobileVerfied = this.verificationCode === parseInt(code) ? true: false;
	}

	onSubmit(): void {
		if (!this.isMobileVerfied) return;

		this.apiService.post('/users', this.theForm.value).subscribe({
			next: (resp: GenericApiResponse) => {
				this.router.navigateByUrl('login');
			}
		})
	}
}
