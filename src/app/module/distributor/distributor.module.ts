import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { DistributorListComponent } from './distributor-list/distributor-list.component';
import { AddDistributorComponent } from './add-distributor/add-distributor.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';

const routes: Routes = [
  {
    path: '',
    component: DistributorListComponent,
    data: { title: 'Distributor-list', permission: permission.distributorList },
  },
  {
    path: 'add',
    component: AddDistributorComponent,
    data: { title: 'add-Distributor', permission: permission.addDistributor },
  },
  {
    path: 'edit/:id',
    component: AddDistributorComponent,
    data: { title: 'edit-Distributor', permission: permission.updateDistributor },
  },
];

@NgModule({
  declarations: [
    DistributorListComponent,
    AddDistributorComponent,
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
export class DistributorModule { }
