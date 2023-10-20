import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { validateEmailFormControl, CommonFunction } from 'src/app/shared/common';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotForm: FormGroup;
  formErrors = {
    error: null,
    success: null
  };
  showLoader = false;
  currentCompany: any = null;
  loginType = 'email';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.forgotForm = this.fBuilder.group({
      emailId: [null, Validators.compose([Validators.required, validateEmailFormControl])],
      tenantCode: [null, Validators.compose([Validators.required])],
    });
    if (this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams['isAdmin']) {
      this.isAdmin = this.activatedRoute.snapshot.queryParams['isAdmin'];
      this.forgotForm.patchValue({ tenantCode: 'EBC' })
    } else {
      this.isAdmin = false;
    }
  }

  ngOnInit() { }

  submitForm(): void {
    if (this.forgotForm.valid) {
      this.showLoader = true;
      this.authService.forgotPassword(this.forgotForm.value).subscribe((response) => {
        this.showLoader = false;
        if (response.status == "Ok") {
          this.dataService.forgatAuthSubject.next({ ...response, ...this.forgotForm.value });
          this.formErrors.success = `* ${response.message}`;
          this.router.navigateByUrl('/verification');
          setTimeout(() => { CommonFunction.resetForm(this.forgotForm); }, 3000);
        } else {
          this.toastr.error(response.message)
          this.formErrors.error = `* ${response.message}`;
          this.showLoader = false;
        }
      },
        (error) => {
          this.toastr.error(error.error.message)
          this.formErrors.error = `* ${error.error.message}`;
          this.showLoader = false;
        }
      );
    }
  }
}
