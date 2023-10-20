import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberDirective, FloatNumberDirective } from './directive/number.directive';
import { PricePipe, CardSizeSortForm, CardSizeFullForm, userLicensePipe, TireNamePipe, SafePipe } from './pipe/status.pipe';
import { RouterBackDirective, onlyCharactersDirective, onlyNumbersAndHyphenDirective, onlyCharaterAndHyphenDirective } from './directive/router-back.directive';
import { ActionPopupModule } from '../core/action-popup/action-popup.module';

const components = [
  NumberDirective,
  FloatNumberDirective,
  PricePipe, TireNamePipe, SafePipe,
  CardSizeSortForm,
  CardSizeFullForm,
  userLicensePipe,
  RouterBackDirective,
  onlyCharactersDirective,
  onlyNumbersAndHyphenDirective,
  onlyCharaterAndHyphenDirective
]
@NgModule({
  declarations: components,
  imports: [CommonModule, ActionPopupModule],
  exports: components
})
export class SharedModule { }
