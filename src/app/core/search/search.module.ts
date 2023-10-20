import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { MaterialExModule } from 'src/app/shared/material.module';



@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    MaterialExModule
  ],
  exports: [ 
    SearchComponent
  ]
})
export class SearchModule { }
