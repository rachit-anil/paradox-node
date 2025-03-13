import {Component, OnInit} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {SnackbarService} from "../../services/snackbar.service";
import {MatDialog} from "@angular/material/dialog";
import {EditUserDialogComponent} from "./edit-user-dialog/edit-user-dialog.component";

@Component({
  selector: 'user-component',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, NgIf],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  isUserAuthenticated = false;

  constructor(private authService: AuthService,
              private router: Router,
              private snackbarService: SnackbarService,
              private dialog: MatDialog) {
    this.editUserDetails()
  }

  ngOnInit() {
    this.authService.isUserAuthenticated$.subscribe(
        (isUserAuthenticated: boolean) => {
          this.isUserAuthenticated = isUserAuthenticated;
        }
    );
  }

  editUserDetails(){
    this.dialog.open(EditUserDialogComponent, {
      width: '350px',
    });
  }

  logout(){
    this.authService.logoutUser();
    this.router.navigate(["login"]);
    this.snackbarService.openSnackBar("Logout successful");
  }
}
