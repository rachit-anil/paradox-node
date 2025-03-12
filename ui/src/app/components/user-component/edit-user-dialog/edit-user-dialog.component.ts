import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {UserService} from "../../../services/user.service";
@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  ngOnInit() {

  }

  saveUserDetails(){

    // If using a PUT request we should send the entire User object.
    const user = {
      username: 'rachit9910102312',
      mobileNumber: '9711564369',
    }
    this.userService.saveUserInfo(user).subscribe({
      next: (response: any) => {console.log(response)},
      error: (error: any) => {console.log(error)},
      complete: () => {}
    });
  }
}
