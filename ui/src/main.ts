import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import { RouterModule, provideRouter } from "@angular/router";
import { AuthGuard } from "./app/guards/auth.guard";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {AuthInterceptor} from "./app/interceptors/auth-interceptor";

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
      { path: "**", redirectTo: "home", pathMatch: "full" },
    ]),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
