import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of } from "rxjs";
import { map, tap, catchError, finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (this.authService.isUserAuthenticated) return of(true);
    // this.router.navigate(["/login"]);
    // return of(false);
    return this.authService.checkJsessionValidity().pipe(
      map((res: any) => {
        if (res.successMessage) {
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.router.navigate(["/login"]);
        return of(false);
      })
    );
  }

  // if (this.authService.isUserAuthenticated()) {
  //   return true; // Allow access to the route
  // } else {
  //   this.router.navigate(["/login"]); // Redirect to login page if not authenticated
  //   return false;
  // }
}
