import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, of } from "rxjs";
import {JWTService} from "../services/jwt.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JWTService, private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    if (this.jwtService.isTokenValid()) return of(true);
    this.authService.logoutUser();
    return of(false);
  }
}
