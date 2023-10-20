import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/core/pagination/pagination.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { AddConnectsComponent } from './add-connects/add-connects.component';
import { MyConnectsListComponent } from './my-connects-list/my-connects-list.component';
import { SearchModule } from 'src/app/core/search/search.module';
import { permission } from 'src/app/shared/permission';
import { OtherConnectsListComponent } from './other-connects-list/other-connects-list.component';
import { NgxVcardModule } from 'ngx-vcard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'my'
  },
  {
    path: "my",
    component: MyConnectsListComponent,
    data: { title: 'connects-list', permission: permission.myConnects }
  },
  {
    path: "other",
    component: OtherConnectsListComponent,
    data: { title: 'connects-list', permission: permission.otherConnects }
  },
  {
    path: "add",
    component: AddConnectsComponent,
    data: { title: 'add-connects', permission: permission.scanMyCard }
  },
  {
    path: 'edit/:id',
    component: AddConnectsComponent,
    data: { title: 'edit-connects', permission: permission.scanMyCard }
  }
]

@NgModule({
  declarations: [OtherConnectsListComponent, MyConnectsListComponent, AddConnectsComponent],
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
    NgxVcardModule
  ]
})
export class ConnectsModule { }
