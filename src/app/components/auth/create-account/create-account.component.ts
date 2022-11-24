import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Validation from 'src/app/common/validators';
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
	verificationCode: number | null = null; 
	theForm: FormGroup;
	disableVerifyBtn = false;
	disableSubmitBtn = false;
	message: string = '';

	constructor(private route: ActivatedRoute,
				private fb: FormBuilder,
				private apiService: ApiService) 
	{
		this.accountType = route.snapshot.params['type'] as LoginAccountType;

		this.theForm = fb.group({
			name: new FormControl('', [Validators.required]),
			mobileNumber: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required])
		}, { validators: [Validation.match('password', 'confirmPassword')]});
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

		this.disableSubmitBtn = true;

		const payload = this.theForm.value;
		payload.type = this.accountType;
		payload.confirmPassword = undefined;

		this.apiService.post('/users', payload).subscribe({
			next: (resp: GenericApiResponse) => {
				this.disableSubmitBtn = false;

				this.message = resp.message;
				this.verificationCode = null;
				this.isMobileVerfied = false;
				this.theForm.reset();
			},
			error: () => this.disableSubmitBtn = false
		})
	}
}
