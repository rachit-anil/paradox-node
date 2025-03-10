import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

const apiUrl = `${environment.baseUrl}`;

@Injectable({
    providedIn: 'root',
})
export class CsrfService {
    private csrfToken: string | null = null;

    constructor(private http: HttpClient) {}

    getCsrfToken(): Observable<{ csrfToken: string }> {
        return this.http.get<{ csrfToken: string }>(`${apiUrl}/csrf-token`).pipe(
            tap((response) => {
                this.csrfToken = response.csrfToken;
            })
        );
    }

    getCsrfTokenValue(): string | null {
        return this.csrfToken;
    }

    // Example of a POST request with CSRF token
    protectedPost(data: any): Observable<any> {
        if (!this.csrfToken) {
            throw new Error('CSRF token not available. Call getCsrfToken() first.');
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': this.csrfToken, // or _csrf, depending on your backend
        });

        return this.http.post('/protected', data, { headers });
    }

    //Example of a POST request with CSRF token in the body
    protectedPostBody(data: any): Observable<any> {
        if (!this.csrfToken) {
            throw new Error('CSRF token not available. Call getCsrfToken() first.');
        }

        return this.http.post('/protected', {...data, _csrf: this.csrfToken}); // or X-CSRF-TOKEN, depending on your backend
    }
}
