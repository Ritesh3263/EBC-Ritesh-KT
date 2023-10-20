import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialExModule } from 'src/app/shared/material.module';
import { PageNotfoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: "",
    component: PageNotfoundComponent,
    data: { title: '404' }
  }
]

@NgModule({
  declarations: [PageNotfoundComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    RouterModule.forChild(routes),
  ],
})
export class NotfoundModule { }
