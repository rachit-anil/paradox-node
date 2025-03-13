import { Component, OnInit } from "@angular/core";
import { LoginComponent } from "../login/login.component";
import { SignUpComponent } from "../sign-up/sign-up.component";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-sign-up",
  standalone: true,
  imports: [CommonModule, LoginComponent, SignUpComponent, MatButtonModule],
  templateUrl: "./login-sign-up.component.html",
  styleUrl: "./login-sign-up.component.scss",
})
export class LoginSignUpComponent implements OnInit {
  selectedComponent = "login";
  isUserAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated;
    if (this.isUserAuthenticated) {
      this.router.navigate([""]);
    }
  }

  signUpWithGoogle(){
    this.authService.signUpWithGoogle();
  }
}
