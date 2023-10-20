import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { RouterBackDirective } from 'src/app/shared/directive/router-back.directive';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
    data: { title: 'forgot_password' }
  }
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    I18nModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    AuthService
  ]
})
export class ForgotPasswordModule { }
