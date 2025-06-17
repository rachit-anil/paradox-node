import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
} from '@angular/material/dialog';
import {UserService} from "../../../services/user.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SnackbarService} from "../../../services/snackbar.service";
@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [  ReactiveFormsModule,MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, FormsModule, MatError, MatFormField, MatInput, MatLabel],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent implements OnInit {
  userForm!: FormGroup;
  user: any;

  constructor(
              private userService: UserService,
              private fb: FormBuilder,
              private snackbarService: SnackbarService,
              private dialogRef: MatDialogRef<EditUserDialogComponent>) {
  }

  // add dob and profile picture later
  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: ["rrr", Validators.required],
      lastName: ["", Validators.required],
      mobile: ["", Validators.required],
      email: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(5)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
    });
    this.fetchUser();

    this.userForm.patchValue({
      firstName: 'Empty',
      lastName: 'Empty',
      mobile: 'Empty',
      email: 'Empty',
      password: "Empty",
      username: "Empty"
    })
  }

  get firstName(): FormControl {
    return this.userForm.get("firstName") as FormControl;
  }

  get lastName(): FormControl {
    return this.userForm.get("lastName") as FormControl;
  }

  get mobile(): FormControl {
    return this.userForm.get("mobile") as FormControl;
  }

  get email(): FormControl {
    return this.userForm.get("email") as FormControl;
  }

  get password(): FormControl {
    return this.userForm.get("password") as FormControl;
  }

  get username(): FormControl {
    return this.userForm.get("username") as FormControl;
  }


  saveUserDetails(){
    // If using a PUT request we should send the entire User object.
    const user = this.userForm.value;
    this.userService.saveUserInfo(user).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackbarService.openSnackBar("User details saved successfully.");
        this.dialogRef.close();
        },
      error: (error: any) => {console.log(error)},
      complete: () => {}
    });
  }

  // password has to be hashed on backend again
  // password: response.password || "",

  private fetchUser() {
    this.userService.getUser().subscribe({
      next: (response: any) => {
        console.log(response);
        this.user = response;
        this.userForm.patchValue({
          firstName: response.firstName || 'Empty',
          lastName: response.lastName || 'Empty',
          mobile: response.mobile || 123456789,
          password: response.password || "",
          email: response.email || 'Empty',
          username: response.username || "Empty"
        });
      },
      error: (error: any) => {console.log(error)},
    });
  }
}
