import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import {SnackbarService} from "../../services/snackbar.service";
import {TokenCounterComponent} from "../../components/token-counter/token-counter.component";
import {UserComponent} from "../../components/user-component/user.component";

@Component({
  selector: "app-navbar",
  standalone: true,
    imports: [RouterModule, CommonModule, MatButtonModule, TokenCounterComponent, UserComponent],
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
    this.authService.logoutUser();
    this.router.navigate(["login"]);
    this.snackbarService.openSnackBar("Logout successful");
  }
}
