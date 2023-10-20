import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { MaterialExModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    MaterialExModule
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule { }
