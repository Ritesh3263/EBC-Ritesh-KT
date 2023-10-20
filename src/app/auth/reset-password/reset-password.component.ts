import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonFunction, PasswordValidation } from 'src/app/shared/common';
import { UserService } from 'src/app/service/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']

})
export class ResetPasswordComponent implements OnInit {

  hide = true;
  hide1 = true;
  resetPasswordForm: FormGroup;
  formErrors = {
    error: null,
    success: null,
  };
  showLoader = false;
  forgatAuth: any;

  constructor(
    private router: Router,
    private authService: UserService,
    private dataService: DataService,
    private fBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.resetPasswordForm = this.fBuilder.group({
      new_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])], // validatePassword
      confirm_password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {
      validator: PasswordValidation.passwordValidation()
    });
    this.dataService.forgatAuth.subscribe((response) => {
      if (response) {
        this.forgatAuth = response;
      } else {
        this.router.navigateByUrl('/forgot-password')
      }
    });
  }

  ngOnInit() { }

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      this.showLoader = true;
      const formData = {
        tenantCode: this.forgatAuth.tenantCode,
        emailId: this.forgatAuth['emailId'],
        password: this.resetPasswordForm.value.confirm_password,
      };
      this.authService.changePassword(formData).subscribe((response) => {
        this.showLoader = false;
        if (response && response.status == "Ok") {
          this.toastrService.success(response.message);
          this.formErrors.success = `* ${response.message}`;
          this.router.navigateByUrl('/login');
          setTimeout(() => { CommonFunction.resetForm(this.resetPasswordForm); }, 1000);
        } else {
          this.toastrService.success(response.status);
          this.formErrors.error = `* ${response.error}`;
        }
      }, (error) => {
        this.formErrors.error = `* ${error.error}`;
        this.showLoader = false;
        // this.toastrService.success(error.error.message);
        this.router.navigateByUrl('/login');
      });
    }
  }

}
