import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginAccountType } from './../../../models';


@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {
	accountType: LoginAccountType = 'Client';
	theForm: FormGroup;

	constructor(private route: ActivatedRoute) {
		this.accountType = route.snapshot.params['type'] as LoginAccountType;

		this.theForm = new FormGroup({
			name: new FormControl('', [Validators.required]),
			mobileNumber: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit(): void {
	}

	onSubmit(): void {
		console.log(this.theForm.value);
	}
}
