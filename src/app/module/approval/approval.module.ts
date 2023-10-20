import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalProcessComponent } from './approval-process/approval-process.component';
import { ApprovalDoneComponent } from './approval-done/approval-done.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { UserRequestLogComponent } from './user-request-log/user-request-log.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'approval'
  },
  {
    path: "approval-process",
    component: ApprovalProcessComponent,
    data: { title: 'approval-proccess' }
  },
  {
    path: "approval",
    component: ApprovalDoneComponent,
    data: { title: 'approval' }
  },
  {
    path: "user-log",
    component: UserRequestLogComponent,
    data: { title: 'user-log' }
  }
]


@NgModule({
  declarations: [
    ApprovalProcessComponent,
    ApprovalDoneComponent,
    UserRequestLogComponent
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
    SearchModule,
  ]
})
export class ApprovalModule { }
