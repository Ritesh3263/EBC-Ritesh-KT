import { Component, OnInit, Input } from '@angular/core';
import { NavLink } from 'src/app/module/side-nav-links';
import * as $ from 'jquery';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
@AutoUnsubscribe()
@Component({
  selector: 'app-aside-nav',
  templateUrl: './aside-nav.component.html',
  styleUrls: ['./aside-nav.component.scss'],
})
export class AsideNavComponent implements OnInit {
  @Input() asideNav = NavLink.asideNav;
  isShown: boolean;
  isShown2: boolean;
  isShown3: boolean;
  isShown4: boolean;
  sidenavshow: boolean;
  currentUser: any;
  permissionObject: any = null;
  permissionCode = permission;

  constructor(private dataService: DataService) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });
  }

  ngOnInit() {
    this.isShown = false;
    this.isShown2 = false;
    this.isShown4 = false;
    this.sidenavshow = true;
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }

  toggleShowsidebar() {
    this.sidenavshow = !this.sidenavshow;
    if (!this.sidenavshow) {
      $('.sideNav').css('width', '110px');
      // $('.side-container').css('margin-left', '82px').slideLeft();
      $('.side-container').addClass('wl_82');

      // $('.width-fit').css('width', 'max-content');
      $('.float-right').css('justify-content', 'center');
      $('.nav-link').css('text-align', '-webkit-center');


    }
    else {
      $('.sideNav').css('width', '210px');
      // $('.side-container').css('margin-left', '210px');
      $('.side-container').removeClass('wl_82');

      $('.float-right').css('justify-content', 'flex-end');
      $('.width-fit').css('width', 'auto');

    }
  }
  ShowsidebarMob() {
    if (window.innerWidth <= 575) {
      $('.sideNav').css('width', '0');
      $('.side-container').css('margin-left', '0');
      $('.overlay').css('display', 'none');
    }
  }
  ngOnDestroy(): void {
  }
}
