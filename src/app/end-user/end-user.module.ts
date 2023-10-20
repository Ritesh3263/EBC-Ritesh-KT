import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndUserComponent } from './end-user/end-user.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxVcardModule } from 'ngx-vcard';
import { AuthService } from 'src/app/service/auth.service';
import { APP_NAME } from 'src/app/shared/messages';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { FormValidationModule } from '../shared/form-validation/form-validation.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialExModule } from '../shared/material.module';
import { SharedModule } from '../shared/shared.module';
import { I18nModule } from '../shared/i18n/i18n.module';
import { LoaderModule } from '../core/loader/loader.module';

export const routes: Routes = [
  {
    path: '',
    component: EndUserComponent,
    data: {
      title: 'End User',
      tags: [
        {
          name: 'title',
          content: `End User meta title | ${APP_NAME}`,
        },
        {
          name: 'description',
          content: 'End User meta description',
        },
      ],
    },
  },
  {
    path: 'enquiry',
    component: EnquiryComponent,
    data: {
      title: 'Enquiry',
      tags: [
        {
          name: 'title',
          content: `Enquiry meta title | ${APP_NAME}`,
        },
        {
          name: 'description',
          content: 'Enquiry meta description',
        },
      ],
    },
  },
];

@NgModule({
  declarations: [EndUserComponent, EnquiryComponent],
  imports: [
    CommonModule,
    NgxVcardModule,
    ReactiveFormsModule,
    FormsModule,
    FormValidationModule,
    MaterialExModule,
    // SharedModule,
    I18nModule,
    LoaderModule,
    RouterModule.forChild(routes),
  ],
  providers: [AuthService],
})
export class EndUserModule { }
