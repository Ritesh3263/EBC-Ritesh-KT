import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { AddTenantComponent } from './add-tenant/add-tenant.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { SuccessPopupModule } from 'src/app/core/success-popup/success-popup.module';
import { RenewalTenantComponent } from './renewal-tenant/renewal-tenant.component';

const routes: Routes = [
  {
    path: "",
    component: TenantListComponent,
    data: { title: 'Tenant List', permission: permission.tenantList}

  },
  {
    path: "add",
    component: AddTenantComponent,
    data: { title: 'Add Tenant', permission: permission.addTenant }
  },
  {
    path: 'edit/:id',
    component: AddTenantComponent,
    data: { title: 'Update Tenant', permission: permission.updateTenant }
  },
  {
    path: 'renewal/:id',
    component: RenewalTenantComponent,
    data: { title: 'Update Tenant', permission: permission.updateTenant }
  }
]

@NgModule({
  declarations: [TenantListComponent, AddTenantComponent, RenewalTenantComponent],
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
  ]
})
export class TenantModule { }
