import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TenantProfileComponent } from './tenant-profile/tenant-profile.component';
import { TenantEditProfileComponent } from './tenant-edit-profile/tenant-edit-profile.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SharedModule } from 'src/app/shared/shared.module';


export const routes: Routes = [
  {
    path: '',
    component: TenantEditProfileComponent
  }
]

@NgModule({
  declarations: [
    // TenantProfileComponent,
    TenantEditProfileComponent
  ],
  imports: [
    CommonModule, MaterialExModule,SharedModule,
    RouterModule.forChild(routes),
    FormsModule, ReactiveFormsModule, FormValidationModule,
    LoaderModule
  ]
})
export class TenantProfileModule { }
