import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { ExpiryReportComponent } from './expiry-report/expiry-report.component';
import { ActivationReportComponent } from './activation-report/activation-report.component';
import { RouterModule, Routes } from '@angular/router';
// import { MatInputModule } from '@angular/material/input/input-module';
// import { MatFormFieldModule } from '@angular/material/form-field/form-field-module';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LicenseUsageComponent } from './license-usage/license-usage.component';
import { CardUsageComponent } from './card-usage/card-usage.component';
import { UserLoginComponent } from './user-login/user-login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inventory'
  },
  {
    path: 'inventory',
    component: InventoryReportComponent
  },
  {
    path: 'expiry',
    component: ExpiryReportComponent
  },
  {
    path: 'activation',
    component: ActivationReportComponent
  },
  {
    path: 'license-usage',
    component: LicenseUsageComponent
  },
  {
    path: 'card-usage',
    component: CardUsageComponent
  },
  {
    path: 'user-login-report',
    component: UserLoginComponent
  }
]

@NgModule({
  declarations: [
    InventoryReportComponent,
    ExpiryReportComponent,
    ActivationReportComponent,
    CardUsageComponent,
    LicenseUsageComponent,
    UserLoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    SharedModule,
    PaginationModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    DatePipe
  ]
})
export class ReportModule { }
