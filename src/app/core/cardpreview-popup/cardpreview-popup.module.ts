import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardpreviewPopupComponent } from './cardpreview-popup/cardpreview-popup.component';
import { MaterialExModule } from 'src/app/shared/material.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    CardpreviewPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialExModule,
    MatButtonModule
  ],
  exports: [CardpreviewPopupComponent]

})
export class CardpreviewPopupModule { }
