import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import {JWTService} from "../services/jwt.service";
import {
    BehaviorSubject,
    catchError,
    filter,
    finalize,
    Observable,
    switchMap,
    take,
    throwError
} from "rxjs";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

    constructor(private authService: AuthService,private jwtService: JWTService, private router: Router) {} // Inject your AuthService and Router

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const token = this.jwtService.getToken(); // Get your auth token

        if (token) {
            request = this.addToken(request, token);
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401) {
                    return this.handle401Error(request, next);
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private handle401Error(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.jwtService.setJwtToken(token.jwtToken);
                    this.refreshTokenSubject.next(token.jwtToken); // Assuming your refresh token returns a new access token
                    return next.handle(this.addToken(request, token.jwtToken));
                }),
                catchError((err) => {
                    if(err.url.includes('/auth/refreshToken')){
                        this.isRefreshing = false;
                        this.jwtService.clearToken();
                        this.router.navigate(['/login']); // Navigate to login
                    }
                    return throwError(() => err);
                }),
                finalize(() => {
                    this.isRefreshing = false;
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter((jwtToken) => jwtToken !== null),
                take(1),
                switchMap((jwtToken) => next.handle(this.addToken(request, jwtToken)))
            );
        }
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

//     private addToken(request: HttpRequest<any>): HttpRequest<any> {
//         // Add the JWT token to the request headers
//         const token = this.jwtService.getToken();  // Get the current JWT token from the auth service
//         return request.clone({
//             setHeaders: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//     }
// }
//

// .pipe(
//     switchMap((response: any) => {
//         localStorage.setItem('jwtToken', response.jwtToken);
//         const clonedRequest = request.clone({
//             setHeaders: {
//                 Authorization: `Bearer ${response.jwtToken}`,
//             },
//         });
//         return next.handle(clonedRequest);
//     }),
//     catchError((error) => {
//         console.log("refresh token fetching failed");
//         return of({message: error.message});
//     })
// )


// Send the request and handle errors
// return next.handle(request)
//     .pipe(
//         catchError((error) => {
//             if (error.status === 401) {
//                 return this.authService.refreshToken()
//                     .pipe(
//                         switchMap((response: any)=>{
//                             const clonedRequest = request.clone({
//                                 setHeaders: {
//                                     Authorization: `Bearer ${response.jwtToken}`,
//                                 },
//                             });
//                             return next.handle(clonedRequest)
//                         })
//                     )
//             }
//             return throwError(error);
//         })
//     );