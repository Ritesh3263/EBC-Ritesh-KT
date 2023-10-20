import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BusinessUnitProfileComponent } from './business-unit-profile.component';
import { BusinessUnitEditProfileComponent } from './business-unit-edit-profile/business-unit-edit-profile.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { MaterialExModule } from 'src/app/shared/material.module';

export const routes: Routes = [
  {
    path: '',
    component: BusinessUnitEditProfileComponent
  }
]

@NgModule({
  declarations: [
    // BusinessUnitProfileComponent,
    BusinessUnitEditProfileComponent
  ],
  imports: [
    CommonModule, RouterModule.forChild(routes), MaterialExModule,
    FormsModule, ReactiveFormsModule, FormValidationModule
  ]
})
export class BusinessUnitProfileModule { }
