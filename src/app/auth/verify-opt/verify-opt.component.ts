import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
@Component({
  selector: 'app-verify-opt',
  templateUrl: './verify-opt.component.html',
  styleUrls: ['./verify-opt.component.scss']
})
export class VerifyOptComponent implements OnInit {
  otpForm: FormGroup;
  forgatAuth: any = null;

  constructor(
    private router: Router,
    private fBuilder: FormBuilder,
    private dataService: DataService,
    private toastrService: ToastrService
  ) {
    this.otpForm = this.fBuilder.group({
      otp: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
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
  onOtpChange(data) {
    this.otpForm.patchValue({ otp: data })
  }

  submitForm(): void {
    if (this.otpForm.valid) {
      if (Number(this.forgatAuth.data) == Number(this.otpForm.value['otp'])) {
        this.router.navigateByUrl('/reset-password')
      } else {
        this.toastrService.error('Invalid OTP')
      }
    }
  }
}
