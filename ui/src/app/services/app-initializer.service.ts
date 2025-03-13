import {APP_INITIALIZER, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, from} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import {Router} from "@angular/router";
import {AuthService} from "./auth.service"; // Install: npm install ngx-cookie-service

@Injectable({
    providedIn: 'root',
})
export class AppInitializerService {
    constructor(private authService: AuthService,
                private router: Router,
                private http: HttpClient,
                private cookieService: CookieService) {
    }

    init(): Observable<any> {
        const jwtToken = this.cookieService.get('jwtToken'); // Replace 'jwt_token' with your cookie name

        if (!jwtToken) {
            console.log('No JWT token found in cookie.');
            this.router.navigate(['/login']);
            return of(null); // No token, proceed without verification
        }

        return this.authService.checkJwtValidity().pipe( // Replace '/api/verify-token' with your API endpoint
            map((response: any) => {
                console.log('JWT token verified successfully:', response);
                if (response.isValid) {
                    this.authService.setUserAuthenticationStatus(true);
                }
                // You can store user data or perform other actions here
                return response;
            }),
            catchError((error) => {
                this.router.navigate(['/login']);
                console.error('JWT token verification failed:', error);
                // Handle token verification failure (e.g., redirect to login)
                return of(null); // Proceed with initialization, but indicate failure.
            })
        );
    }
}

export function appInitializerFactory(appInitializer: AppInitializerService): () => Promise<any> {
    return () => appInitializer.init().toPromise();
}

export const appInitializerProviders = [
    AppInitializerService,
    {
        provide: APP_INITIALIZER,
        useFactory: appInitializerFactory,
        deps: [AppInitializerService],
        multi: true,
    },
];