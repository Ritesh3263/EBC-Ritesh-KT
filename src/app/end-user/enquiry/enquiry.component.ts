import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { AuthService } from 'src/app/service/auth.service';
import { FormFieldsMarkAsUntouched } from 'src/app/shared/common';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
  enquiryForm: FormGroup;
  emailRegEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  captchaValue: string;
  data: any;
  userData: any;
  loadingState = false;
  ipAddress: any = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    if (this.activatedRoute.snapshot.queryParams['tc'] && this.activatedRoute.snapshot.queryParams['em']) {
      this.data = { tenantCode: atob(this.activatedRoute.snapshot.queryParams['tc']), emailId: atob(this.activatedRoute.snapshot.queryParams['em']) }
    }
    this.enquiryForm = this.fb.group({
      emailId: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],
      firstName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      mobileNo: [null, Validators.compose([Validators.required])],
      // address: [null, Validators.compose([Validators.required])],
      enquiryData: [null, Validators.compose([Validators.required])],
      reCaptcha: [null, Validators.compose([Validators.required])],
    });
  }

  ngOnInit(): void {
    this.createCaptcha();
  }

  createCaptcha() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.captchaValue = result;
    this.enquiryForm.controls['reCaptcha'].setValue('');
    const params = {
      TenantCode: this.data.tenantCode,
      userEmailId: this.data.emailId
    }
    this.authService.cardPreview(params).subscribe((res) => {
      this.userData = res
    })
  }
  submitForm() {
    this.validCaptcha();
  
    const params = {
      tenantCode: this.data.tenantCode, email: this.data.emailId
    }
    if (this.enquiryForm.valid) {
      let data: any;
      this.loadingState = true;
      this.authService.sendEnquiryMails(this.enquiryForm.value, params).subscribe((data) => {
          this.loadingState = false;
        const dialogRef = this.dialog.open(ActionPopupComponent, {
          width: '683px',
          height: '420px',
          data: { ...data, isEnquiry: true },
          panelClass: 'delete-popup'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.enquiryForm.reset();
          }
        });
      });
    }

  }

  validCaptcha() {
    if ((this.enquiryForm.value['reCaptcha'] != this.captchaValue)) {
      this.enquiryForm.controls["reCaptcha"].setValidators([Validators.required]);
      this.enquiryForm.controls['reCaptcha'].setErrors({ isNotValid: true });
    }
  }

}
