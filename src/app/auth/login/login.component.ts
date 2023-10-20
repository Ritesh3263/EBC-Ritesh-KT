import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { validateEmailFormControl, CommonFunction } from 'src/app/shared/common';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { TenantService } from 'src/app/service/tenant.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponentPopup } from 'src/app/core/change-password-popup/change-password-popup.component';
import { UserService } from 'src/app/service/user.service';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';
@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  hide = true;
  loginForm: FormGroup;
  formErrors = {
    apierror: null
  };
  showLoader = false;
  isAuthenticated: boolean;
  isCompanySelected: boolean;
  loginType = 'email'
  captchaValue: string = '';
  isAdmin: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private fBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataService,
    private tenantService: TenantService,
    public dialog: MatDialog,
    private userService: UserService
  ) {
    this.loginForm = this.fBuilder.group({
      emailId: [null, Validators.compose([Validators.required, validateEmailFormControl])],
      password: [null, Validators.compose([Validators.required])],
      tenantCode: [null, Validators.compose([Validators.required])],
      captcha: [null, Validators.compose([Validators.required])],
      reCaptcha: ['']
    });
    if (this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams['isAdmin']) {
      this.isAdmin = this.activatedRoute.snapshot.queryParams['isAdmin'];
      this.loginForm.patchValue({ tenantCode: 'EBC' })
    } else {
      this.isAdmin = false;
    }
  }

  ngOnInit() {
    this.createCaptcha();
  }

  changeLoginType(type) {
    this.loginType = type;
  }

  getLoginType(type) {
    this.loginType = type;
  }

  submitForm(): void {
    if (this.formErrors.apierror) {
      if (this.loginForm.controls['captcha'].value !== this.loginForm.controls['reCaptcha'].value) {
        this.createCaptcha();
        this.toastr.error('Please enter a valid captcha!!');
        return;
      }
    }
    if (this.loginForm.valid) {
      this.showLoader = true;

      const formData = {
        emailId: this.loginForm.value.emailId.trim(),
        password: this.loginForm.value.password,
        tenantCode: this.loginForm.value.tenantCode.trim(),
      };
      this.authService.login(formData).subscribe((response) => {
        this.showLoader = false;
        if (response) {
          if (response.permissions && response.permissions.length) {
            this.dataService.setAuth(response);
            response.tenantCode ? this.getTenantDetails(response.tenantCode) : '';
            setTimeout(() => { CommonFunction.resetForm(this.loginForm); }, 5000);
            const nextURL = this.activatedRoute.snapshot.queryParamMap.get('next') ?
              this.activatedRoute.snapshot.queryParamMap.get('next') : '/dashboard';
            response.userType == 'End User' ? this.router.navigateByUrl('/my-cards') : this.router.navigateByUrl(nextURL);
            
            this.tenantService.getLicenseWarning(response.user.id).subscribe((data: any) => {
             this.dataService.licanseWarningSubject.next(data);
            })
            this.getBulkUploadStatus()
            if (response.user.isFirstTimeLogin) {
              const dialogRef = this.dialog.open(ChangePasswordComponentPopup, {
                disableClose: true,
                // width: '683px',
                // height: '554px',
                data: response,
                panelClass: 'delete-popup'
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result && result.is_delete) {
                  // this.roleService.deleteRole(result.id).subscribe((res) => {
                  //   this.getObjects();
                  // })
                }
              });
            }
          }
          else {
            this.toastr.warning('please contact to administration.', 'Permission Denied');
          }
        } else {
          this.formErrors.apierror = `* ${response.error[0]}`;
        }
      }, (error) => {
        this.createCaptcha();
        this.toastr.error(error.error.Message);
        this.formErrors.apierror = error.error.Message;
        this.showLoader = false;
        this.loginForm.get('reCaptcha').setValidators(Validators.compose([Validators.required]));
        this.loginForm.get('reCaptcha').updateValueAndValidity();
      });
    }
  }

  getBulkUploadStatus() {
    let status = true;
    if(status) {
      let counter = 0;
      const task = setInterval(() => {
        this.userService.getBulkUploadStatus().subscribe((resp) => {
          counter =  counter + 1;
          if(resp.data.statusFront == true && resp.data.status == 'Error') {
            if(counter != 1) {
              this.dialog.open(SuccessPopupComponent, {
                data: { defaultValue: resp.data, callback: 'bulkUploadError' }
               });
            }
            this.userService.loaderSubject.next(false);
            status = false;
          } else if(resp.data.statusFront == true && resp.data.status == 'Ok') {
            this.userService.loaderSubject.next(false);
            status = false;
            if(resp.data.existingUserCount != 0 && resp.data.addedCount == 0 && counter != 1) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadExisting' }
              });
            } else if(resp.data.existingUserCount != 0 && resp.data.addedCount != 0 && counter != 1) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadPartialExisting' }
              });
            } else if(resp.data.existingUserCount == 0 && resp.data.addedCount > 0 && counter != 1){
              this.dialog.open(SuccessPopupComponent, {
                data: { defaultValue: resp.data, callback: 'bulkUploadAll' }
               });
            } else if(resp.data.existingUserCount == 0 && resp.data.addedCount == 0 && counter != 1) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadNoData' }
              });
            }
          } else if(resp.data.statusFront == false) {
            this.userService.loaderSubject.next(true);
            status = true;
          }
          if(!status && counter == 1) {
            clearInterval(task);
          }
          },
          (err) => {
            if(err.status == '401') {
              status = false;
              clearInterval(task);
            }
          }
          
        )
      }, 2000);
    }
  }

  removeError() {
    this.formErrors.apierror = null;
  }

  createCaptcha() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    this.captchaValue = result;
    this.loginForm.controls['captcha'].setValue(result);
    this.loginForm.controls['reCaptcha'].setValue('');
  }

  getTenantDetails(tenantCode): void {
    this.tenantService.getTenantByCodeEndUser({
      "code": tenantCode
    }).subscribe((res) => {
      if (res && res.data)
        this.dataService.currentTenantSubject.next(res);

    })

    // this.tenantService.getTenantList({
    //   "page": 1, "pageSize": 10, "fields": null,
    //   "searchFilter": {
    //     "conditionOperator": 1,
    //     "filters": [{ "propertyName": "Code", "value": tenantCode, "caseSensitive": true }]
    //   }
    // }).subscribe((res) => {
    //   if (res && res.data && res.data.length > 0)
    //     this.dataService.currentTenantSubject.next(res.data[0]);
    // })
  }
  ngOnDestroy(): void {

  }

}
function res(res: any, any: any) {
  throw new Error('Function not implemented.');
}

