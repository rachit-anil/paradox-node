import { Injectable, Provider } from '@angular/core';
import {
    HttpClient,
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class CsrfInterceptor implements HttpInterceptor {
    constructor(private cookieService: CookieService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const csrfToken = this.cookieService.get('_csrf');

        if (csrfToken) {
            const modifiedReq = req.clone({
                setHeaders: {
                    'X-XSRF-TOKEN': csrfToken,
                },
            });
            return next.handle(modifiedReq);
        }

        return next.handle(req);
    }
}