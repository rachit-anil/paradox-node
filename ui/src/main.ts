import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
    withXsrfConfiguration
} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {AuthGuard} from "./app/guards/auth.guard";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AuthInterceptor} from "./app/interceptors/auth-interceptor";
import {CsrfInterceptor} from "./app/interceptors/csrf-interceptor";

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideRouter([
            {
                path: "login",
                loadComponent: () =>
                    import(
                        "./app/authentication/login-sign-up/login-sign-up.component"
                        ).then((m) => m.LoginSignUpComponent),
            },
            {
                path: "",
                loadComponent: () =>
                    import("./app/home/home.component").then((m) => m.HomeComponent),
            },
            {
                path: "gallery",
                loadComponent: () =>
                    import("./app/gallery/gallery.component").then(
                        (m) => m.GalleryComponent
                    ),
                canActivate: [AuthGuard],
            },
            {path: "**", redirectTo: "home", pathMatch: "full"},
        ]),
        provideAnimationsAsync(),
        provideHttpClient(
            withInterceptorsFromDi(),
            withXsrfConfiguration({
                cookieName: '_csrf', // Name of the cookie containing the CSRF token
                headerName: 'X-CSRF-TOKEN', // Name of the header to include the CSRF token
            })),
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true,}
    ],
});
