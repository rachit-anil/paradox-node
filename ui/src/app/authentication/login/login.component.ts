import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "../../services/auth.service";
import {SpinnerService} from "../../services/spinner.service";
import {finalize} from "rxjs";
import {SnackbarService} from "../../services/snackbar.service";
import {JWTService} from "../../services/jwt.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private snackbarService: SnackbarService,
    private jwtService: JWTService,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(5)]],
    });

    this.loginForm.patchValue({
      email: "rachit9910102312@gmail.com",
      password: "rachitanil"
    })
  }

  get username(): FormControl {
    return this.loginForm.get("username") as FormControl;
  }

  get email(): FormControl {
    return this.loginForm.get("email") as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get("password") as FormControl;
  }

  login() {
    this.spinnerService.showSpinner('Logging in');
    this.authService.loginUser(this.loginForm.get("email")!.value, this.loginForm.get("password")!.value)
      .pipe(
        finalize(()=>this.spinnerService.hideSpinner())
      )
      .subscribe((response: any)=>{
        this.authService.setUserAuthenticationStatus(true);
        this.jwtService.setJwtToken(response.jwtToken);
        this.router.navigate([""]);
        this.snackbarService.openSnackBar("Login successful","Close");
      },
        (error)=>{
          this.snackbarService.openSnackBar("Log in unsuccessful","Close")
          console.error("Login failed", error);
        });
  }
}