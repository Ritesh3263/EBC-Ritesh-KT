import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/service/user.service';
import { PasswordValidation } from 'src/app/shared/common';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  PageTitle = "Change Password"
  hide = true;
  hide1 = true;
  hide2 = true;
  loadingState = true;
  addForm: FormGroup;
  validationMessages: any;
  formErrors = {
    old_password: '',
    new_password: '',
    confirm_password: '',
    apierror: '',
  };
  submitAttempt = false;
  showLoader = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.addForm = fb.group({
      old_password: [null, Validators.compose([Validators.required])],
      new_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      confirm_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validator: PasswordValidation.passwordValidation()
    });
  }

  ngOnInit() { }

  submitForm(): void {

    this.submitAttempt = true;
    if (this.addForm.valid) {
      this.showLoader = true;
      const formData = {
        oldPassword: this.addForm.value.old_password,
        newPassword: this.addForm.value.new_password,
      };
      this.userService.updatePassword(formData).subscribe((response) => {
        this.showLoader = false;
        this.submitAttempt = false;
        if (response && response.status == "Ok") {
          this.toastr.success(response.message);
          this.formErrors.old_password = null;
          this.router.navigateByUrl('/dashboard');
        } else {
          this.toastr.error(response.message);
          // response.error.map(obj => {
          //   if (obj.hasOwnProperty('old_password')) {
          //     this.formErrors.old_password = obj.old_password;
          //   }
          //   if (obj.hasOwnProperty('confirm_password')) {
          //     this.formErrors.confirm_password = obj.confirm_password;
          //   }
          //   if (!obj.hasOwnProperty('old_password') && !obj.hasOwnProperty('confirm_password')) {
          //     this.formErrors.apierror = `* ${response.error}`;
          //   }
          // });
        }
      },
        (error) => {
          this.showLoader = false;
          this.submitAttempt = false;
          this.formErrors.apierror = `* Server Error`;
        }
      );
    }
  }
}
