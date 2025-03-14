import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {SnackbarService} from "../../services/snackbar.service";
import {AuthService} from "../../services/auth.service";
import {finalize} from "rxjs";
import {SpinnerService} from "../../services/spinner.service";
import {JWTService} from "../../services/jwt.service";

@Component({
    selector: "app-sign-up",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: "./sign-up.component.html",
    styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
    signUpForm!: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private snackbarService: SnackbarService,
        private authService: AuthService,
        private spinnerService: SpinnerService,
        private jwtService: JWTService,
    ) {
    }

    ngOnInit() {
        this.signUpForm = this.fb.group({
            name: ["", Validators.required],
            mobile: ["", Validators.required],
            email: ["", [Validators.required, Validators.minLength(3)]],
            username: ["", [Validators.required, Validators.minLength(3)]],
            password: ["", [Validators.required, Validators.minLength(5)]],
        });

        this.signUpForm.patchValue({
            name: "Rachit",
            mobile: '9711564369',
            username: "rachit9910102312",
            email: "rachit9910102312@gmail.com",
            password: "rachitanil"
        })
    }

    get mobile(): FormControl {
        return this.signUpForm.get("mobile") as FormControl;
    }

    get username(): FormControl {
        return this.signUpForm.get("username") as FormControl;
    }

    get email(): FormControl {
        return this.signUpForm.get("email") as FormControl;
    }

    get password(): FormControl {
        return this.signUpForm.get("password") as FormControl;
    }

    get name(): FormControl {
        return this.signUpForm.get("name") as FormControl;
    }

    onSubmit() {
        const signUpData = {
            email: this.signUpForm.get("email")!.value,
            password: this.signUpForm.get("password")!.value,
        };

        // name: this.signUpForm.get("name")!.value,
        //     mobile: this.signUpForm.get("mobile")!.value,

        this.authService.registerUser(signUpData)
            .subscribe({
                next: () => {
                    this.snackbarService.openSnackBar("User registration successful");
                    this.loginUser(signUpData)
                },
                error: () => {
                    this.snackbarService.openSnackBar("User registration unsuccessful");
                    this.spinnerService.hideSpinner();
                }
            });
    }

    loginUser(signUpData: any) {
        this.authService.loginUser(signUpData.email, signUpData.password)
            .pipe(
                finalize(() => this.spinnerService.hideSpinner())
            )
            .subscribe(
                {
                    next: (response: any) => {
                        this.authService.setUserAuthenticationStatus(true);
                        this.jwtService.setJwtToken(response.jwtToken);
                        this.router.navigate([""]);
                        this.snackbarService.openSnackBar("Login successful","Close");
                    },
                    error: error => {
                        this.snackbarService.openSnackBar("Log in unsuccessful", "Close")
                        console.error("Login failed", error);
                    },
                    complete: () => {
                        this.spinnerService.hideSpinner();
                    }
                });
    }
}
