import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDropComponent } from './profile-drop.component';
import { RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [ProfileDropComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialExModule
  ],
  exports: [
    ProfileDropComponent
  ]
})
export class ProfileDropModule { }
