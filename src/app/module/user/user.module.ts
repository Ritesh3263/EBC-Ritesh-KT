import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { UserListComponent } from './user-list/user-list.component';
import { AddUserComponent } from './add-user/add-user.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { BulkUploadUserComponent } from './bulk-upload-user/bulk-upload-user.component';
import { SuccessPopupModule } from 'src/app/core/success-popup/success-popup.module';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: "",
    component: UserListComponent,
    data: { title: 'User List', permission: permission.userList }
  },
  {
    path: "add",
    component: AddUserComponent,
    data: { title: 'Add User', permission: permission.addUser }
  },
  {
    path: 'add-bulk',
    component: BulkUploadUserComponent,
    data: { title: 'Add Bulk User',permission: permission.addUser },
  },
  {
    path: 'edit/:id',
    component: AddUserComponent,
    data: { title: 'Update User', permission: permission.updateUser }
  }
]

@NgModule({
  declarations: [UserListComponent, AddUserComponent, BulkUploadUserComponent],
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
    SuccessPopupModule,
    NgSelectModule
  ]
})
export class UserModule { }
