import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { MaterialExModule } from 'src/app/shared/material.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { ChangePasswordComponentPopup } from './change-password-popup.component';

@NgModule({
  declarations: [ChangePasswordComponentPopup],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormValidationModule,
    SharedModule,
    MaterialExModule,
    MatInputModule,
    MatButtonModule,
    LoaderModule,
  ], providers: [AuthService],
  exports: [ChangePasswordComponentPopup]
})
export class ChangePasswordModule { }
