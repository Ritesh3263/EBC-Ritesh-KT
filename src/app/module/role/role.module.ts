import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { AddRoleComponent } from './add-role/add-role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { SuccessPopupModule } from 'src/app/core/success-popup/success-popup.module';

const routes: Routes = [
  {
    path: "",
    component: RoleListComponent,
    data: { title: 'Role List', permission: permission.roleList}
  },
  {
    path: "add",
    component: AddRoleComponent,
    data: { title: 'Add Role',permission: permission.addRole }
  },
  {
    path: 'edit/:id',
    component: AddRoleComponent,
    data: { title: 'Update Role', permission: permission.editRole }
  }
]

@NgModule({
  declarations: [RoleListComponent, AddRoleComponent],
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
    SuccessPopupModule
  ],
})
export class RoleModule { }
