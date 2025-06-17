import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withXsrfConfiguration
} from "@angular/common/http";
import {provideRouter} from "@angular/router";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {AuthInterceptor} from "./interceptors/auth-interceptor";
import {CsrfInterceptor} from "./interceptors/csrf-interceptor";
import {appInitializerProviders} from "./services/app-initializer.service";
import {provideEffects} from "@ngrx/effects";
import {provideStore} from "@ngrx/store";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import {provideRouterStore} from "@ngrx/router-store";
import {provideEntityData, withEffects} from "@ngrx/data";
import {entityConfig} from "./entity-metadata";
import {routes} from "./app.routes";
import {appReducer} from "./store/app.reducer";
import {AppEffects} from "./store/app.effects";


export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ appState: appReducer }),
    provideEffects([AppEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideEntityData(entityConfig, withEffects()),
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withXsrfConfiguration({
      cookieName: '_csrf', // Name of the cookie containing the CSRF token
      headerName: 'X-CSRF-TOKEN', // Name of the header to include the CSRF token
    })),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    appInitializerProviders,

  ],
};