import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsideNavComponent } from './aside-nav.component';
import { AsideNavRoutingModule } from './aside-nav-routing-module';
import { MaterialExModule } from 'src/app/shared/material.module';
import {MatIconModule} from '@angular/material/icon';
import { I18nModule } from 'src/app/shared/i18n/i18n.module';

@NgModule({
  declarations: [AsideNavComponent],
  imports: [
    CommonModule,
    AsideNavRoutingModule,
    MaterialExModule,
    MatIconModule,
    I18nModule
  ],
  exports: [
    AsideNavComponent
  ]
})
export class AsideNavModule { }
