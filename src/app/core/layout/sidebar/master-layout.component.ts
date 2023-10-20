import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { UserService } from 'src/app/service/user.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent implements OnInit {

  subNavShow: boolean = false;
  brandTitle = "NEC"
  navLink: any = [];
  sidenavshow: boolean;
  activeLang: string;
  languageList = environment.language;
  isCompanySelected: boolean = false;
  currentUser: any;
  warning: any;
  WarningMessage: string;
  iswarning: boolean;
  showLoader: any;

  constructor(
    public translate: TranslateService,
    private dataService: DataService,
    public userService: UserService
  ) {
    this.userService.showMasterLoader.subscribe((res) => {
      this.showLoader = res;
    })

    if (localStorage.getItem('currentLanguage')) {
      (translate.getLangs().includes(localStorage.getItem('currentLanguage')) ?
        this.activeLang = localStorage.getItem('currentLanguage') :
        this.activeLang = environment?.defaultLangCode
      )
    }
    else this.activeLang = environment.defaultLangCode;
    this.dataService.currentUser.subscribe((res) => {
      if (res) {
        this.currentUser = res;
      }
    });
  }

  ngOnInit() {
    this.activeLang = this.translate.currentLang;
    this.sidenavshow = true;
    this.dataService.licanseWarning.subscribe((res) => {
      this.warning = res;
      if (this.warning && this.warning.status == "Warning") {
        this.iswarning = true;
        this.WarningMessage = this.warning.message
      } else {
        this.iswarning = false;
      }
    });
  }
  searchObject(a) {
  }

  onLanguageChange(): void {
    localStorage.setItem('currentLanguage', this.activeLang);
    window.location.reload();
  }
  ShowsidebarMob() {
    // this.sidenavshow = !this.sidenavshow;
    if ($('.sideNav').css('width') == '0px') {
      $('.sideNav').css('width', '210px');
      $('.overlay').css('display', 'block');
    }
    else {
      $('.sideNav').css('width', '0px');
      $('.overlay').css('display', 'none');
    }
  }
  ngOnDestroy(): void { }
}
