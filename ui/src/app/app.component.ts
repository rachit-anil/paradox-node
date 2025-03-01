import { Component, OnInit } from "@angular/core";
import {
  RouterModule,
  RouterOutlet,
} from "@angular/router";
import { LoginComponent } from "./authentication/login/login.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ProgressService } from "./services/progress.service";
import { NavbarComponent } from "./common/navbar/navbar.component";
import { finalize } from "rxjs";
import { AuthService } from "./services/auth.service";
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SpinnerService} from "./services/spinner.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RouterModule,
    MatProgressBarModule,
    NavbarComponent,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  title = "projectParadox";
  showProgress = false;
  showRouter = true;
  showSpinner= false;
  spinnerText ='';

  constructor(
    private authService: AuthService,
    private progressService: ProgressService,
    private _snackBar: MatSnackBar,
    private spinnerService: SpinnerService
  ) {}

  async fetchPublicData(){
    await fetch("http://api.projectparadox.in:8080/auth/public").then((response: Response) => {})
    console.log("data fetched");
  }

  ngOnInit() {
    // this.spinnerService.spinnerStatus.subscribe(spinnerData => {
    //   this.showSpinner = spinnerData.showSpinner;
    //   this.spinnerText = spinnerData.message || '';
    // });
    // this.progressService.progressStatus.subscribe(
    //   (showProgress: boolean) => (this.showProgress = showProgress)
    // );
    // this.authService
    //   .checkJsessionValidity()
    //   .pipe(
    //     finalize(() => {
    //       this.showRouter = true;
    //       this.progressService.hideProgressBar();
    //     })
    //   )
    //   .subscribe(
    //     (response: any) => {
    //       if (response.successMessage) {
    //         this.authService.setUserAuthenticationStatus(true);
    //       }
    //     },
    //     () => {
    //       this.authService.setUserAuthenticationStatus(false);
    //     }
    //   );
  }


}

// edit user info  - name, phone , otp , email
// what if the user is logged out from the server ...  ?
// control session validity from the UI .. show timer
// extend session
// logout functionality // forget password
// delete account - de activation  - cool off period -- cron job
// role based pages //admin- full access   end user - // reader
// upon authentication - gallery directly  not working
// username taken.. password not too strong
// csrf protection
// rate limiting the apis
// Setting - icon in header
// footer
// delay selction via slider

// dark mode
// use NgRx Store to perform login logout related common actions