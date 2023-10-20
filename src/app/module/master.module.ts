import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { AsideNavModule } from 'src/app/core/aside-nav/aside-nav.module';
import { NotificationsModule } from 'src/app/core/notifications/notifications.module';
import { ProfileDropModule } from 'src/app/core/profile-drop/profile-drop.module';
import { SearchModule } from 'src/app/core/search/search.module';
import { MasterLayoutComponent } from '../core/layout/sidebar/master-layout.component';
import { FormsModule } from '@angular/forms';
import { MaterialExModule } from '../shared/material.module';
import { I18nModule } from '../shared/i18n/i18n.module';

@NgModule({
  declarations: [MasterLayoutComponent],
  imports: [
    CommonModule,
    MasterRoutingModule,
    AsideNavModule,
    NotificationsModule,
    ProfileDropModule,
    FormsModule,
    SearchModule,
    MaterialExModule,
    I18nModule
  ]
})
export class MasterModule { }
