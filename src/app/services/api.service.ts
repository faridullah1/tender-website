import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
	baseUrl = '/api';

  	constructor(private http: HttpClient) { }

	get(slug: string): Observable<any> {
		return this.http.get(this.baseUrl + slug);
	}
}
