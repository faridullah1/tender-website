import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    
	constructor(private apiService: ApiService) { }

	ngOnInit(): void {
		this.apiService.get('/login').subscribe(resp => {
			console.log(resp);
		});
	}
}
