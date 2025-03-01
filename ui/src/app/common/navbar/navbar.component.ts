import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [RouterModule, CommonModule, MatButtonModule],
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
  isUserAuthenticated = false;
  constructor(private authService: AuthService, private router: Router, private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.authService.isUserAuthenticated$.subscribe(
      (isUserAuthenticated: boolean) => {
          this.isUserAuthenticated = isUserAuthenticated;
      }
    );
  }

  logout(){
    this.authService.logoutUser().subscribe(
        ()=>{
          this.authService.setUserAuthenticationStatus(false);
            this.snackbarService.openSnackBar("Logout successful")
            this.router.navigate([""]);
        },
        ()=>{
          this.snackbarService.openSnackBar("Logout unsuccessful")
        }
    );
  }
}
