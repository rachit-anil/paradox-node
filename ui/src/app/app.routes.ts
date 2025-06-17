import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
import {provideState} from "@ngrx/store";
import {galleryReducer} from "./components/gallery/store/gallery.reducer";
import {provideEffects} from "@ngrx/effects";
import {GalleryEffects} from "./components/gallery/store/gallery.effects";

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./authentication/login-sign-up/login-sign-up.component").then((m) => m.LoginSignUpComponent),
    },
    {
        path: "",
        loadComponent: () => import("./components/home/home.component").then((m) => m.HomeComponent),
    },
    {
        path: "gallery",
        loadComponent: () => import("./components/gallery/gallery.component").then((m) => m.GalleryComponent),
        canActivate: [AuthGuard],
        providers: [
            provideState({ name: 'gallery', reducer: galleryReducer }), // Provide feature state
            provideEffects(GalleryEffects), // Provide feature effects
        ],
    },
    { path: "**", redirectTo: "home", pathMatch: "full" },
];
