import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PaginationComponent],
  imports: [
    CommonModule,
    MaterialExModule,
    FormsModule
  ], exports: [PaginationComponent]
})
export class PaginationModule { }
