import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GenericApiResponse } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
	private baseUrl = '/api';

  	constructor(private http: HttpClient, private router: Router) { }

	get(slug: string): Observable<any> {
		return this.http.get(this.baseUrl + slug).pipe(catchError(this.handleError));
	}

	post(slug: string, payload: any): Observable<any> {
		return this.http.post<GenericApiResponse>(this.baseUrl + slug, payload).pipe(catchError((error) => this.handleError(error)));;
	}

	private handleError(err: HttpErrorResponse) {
		let errorMessage = err.error.message || err.message;

		if (err.status === 401) {
			this.router.navigateByUrl('/login-type');
		}

		if (err.status === 504) {
			errorMessage = 'Gateway Timeout';
		}

		return throwError(() => new Error(errorMessage));
	}
}
