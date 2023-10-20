import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { AddressAddComponent } from './address-add/address-add.component';
import { AddressListComponent } from './address-list/address-list.component';
import { SuccessPopupModule } from 'src/app/core/success-popup/success-popup.module';

const routes: Routes = [
  {
    path: "",
    component: AddressListComponent,
    data: { title: 'Address list', permission: permission.addressList }
  },
  {
    path: "add",
    component: AddressAddComponent,
    data: { title: 'Add Address', permission: permission.addAddress }
  },
  {
    path: 'edit/:id',
    component: AddressAddComponent,
    data: { title: 'Update Address', permission: permission.updateAddress }
  }
]

@NgModule({
  declarations: [AddressAddComponent, AddressListComponent],
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
export class AddressModule { }
