import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { BusinessUnitListComponent } from './business-unit-list/business-unit-list.component';
import { AddBusinessUnitComponent } from './add-business-unit/add-business-unit.component';
import { BulkUploadBusinessUnitComponent } from './bulk-upload-business-unit/bulk-upload-business-unit.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SuccessPopupModule } from 'src/app/core/success-popup/success-popup.module';

const routes: Routes = [
  {
    path: "",
    component: BusinessUnitListComponent,
    data: { title: 'Business Unit list', permission: permission.businessList }
  },
  {
    path: "add",
    component: AddBusinessUnitComponent,
    data: { title: 'Add Business Unit', permission: permission.addBusiness }
  },
  // {
  //   path: "add-bulk",
  //   component: BulkUploadBusinessUnitComponent,
  //   data: { title: 'add-Business Unit' }
  // },
  {
    path: 'edit/:id',
    component: AddBusinessUnitComponent,
    data: { title: 'Update Business Unit', permission: permission.updateBusiness }
  }
]

@NgModule({
  declarations: [BusinessUnitListComponent, AddBusinessUnitComponent, BulkUploadBusinessUnitComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule,
    LoaderModule,
    SuccessPopupModule
  ],
})
export class BusinessUnitModule { }
