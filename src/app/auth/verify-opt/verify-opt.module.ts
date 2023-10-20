import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { VerifyOptComponent } from './verify-opt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { SharedModule } from 'src/app/shared/shared.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { MaterialExModule } from 'src/app/shared/material.module';

const routes: Routes = [
  {
    path: '',
    component: VerifyOptComponent,
    data: { title: 'verify-opt' }
  }
];

@NgModule({
  declarations: [
    VerifyOptComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    NgOtpInputModule,
    SharedModule,
    MaterialExModule,
    I18nModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthService
  ]
})
export class VerifyOptModule { }
