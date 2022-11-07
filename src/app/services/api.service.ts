import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericApiResponse } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
	private baseUrl = '/api';

  	constructor(private http: HttpClient) { }

	get(slug: string): Observable<any> {
		return this.http.get(this.baseUrl + slug);
	}

	post(slug: string, payload: any): Observable<GenericApiResponse> {
		return this.http.post<GenericApiResponse>(this.baseUrl + slug, payload);
	}
}
