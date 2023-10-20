import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from './card-list/card-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormValidationModule } from 'src/app/shared/form-validation/form-validation.module';
import { MaterialExModule } from 'src/app/shared/material.module';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SharePopupComponent } from './sharepopup/sharepopup.component';
import { permission } from 'src/app/shared/permission';
import { NgxVcardModule } from 'ngx-vcard';
import { LoaderModule } from 'src/app/core/loader/loader.module';
import { WebcamModule } from 'ngx-webcam';
import { CameraModule } from 'src/app/core/camera/camera.module';
import { ScanFormComponent } from './scan-form/scan-form.component';

const routes: Routes = [
  {
    path: "",
    component: CardListComponent,
    data: { title: 'My Card', permission: permission.myCardList }
  },
  {
    path: "scan-card",
    component: ScanFormComponent,
    // data: { title: 'My Card', permission: permission.myCardList }
  },
  // {
  //   path: "scan-card/:id",
  //   component: ScanFormComponent,
  //   // data: { title: 'My Card', permission: permission.myCardList }
  // }
];

@NgModule({
  declarations: [
    CardListComponent,
    SharePopupComponent,
    ScanFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    FormValidationModule,
    MaterialExModule,
    SharedModule,
    QRCodeModule,
    WebcamModule,
    NgxVcardModule,
    LoaderModule,
    CameraModule
  ]
})
export class MycardsModule { }
