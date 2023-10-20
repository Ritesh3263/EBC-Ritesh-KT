import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { ResellerListComponent } from './reseller-list/reseller-list.component';
import { AddResellerComponent } from './add-reseller/add-reseller.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';

const routes: Routes = [
  {
    path: '',
    component: ResellerListComponent,
    data: { title: 'reseller-list', permission: permission.resellerList },
  },
  {
    path: 'add',
    component: AddResellerComponent,
    data: { title: 'add-reseller', permission: permission.addReseller },
  },
  {
    path: 'edit/:id',
    component: AddResellerComponent,
    data: { title: 'edit-reseller', permission: permission.updateReseller },
  },
];

@NgModule({
  declarations: [
    ResellerListComponent,
    AddResellerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    PaginationModule,
    SearchModule
  ]
})
export class resellerModule { }
