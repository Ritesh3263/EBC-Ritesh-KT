import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-profile-drop',
  templateUrl: './profile-drop.component.html',
  styleUrls: ['./profile-drop.component.scss']
})
export class ProfileDropComponent implements OnInit {

  isAuthenticated: boolean;
  isCompanySelected: boolean;

  currentUserDetail: any;
  permission: any = [];
  permissionObject: any = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private commonService: CommonService
  ) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUserDetail = response;
    });

    // this.dataService.isCompanySelected.subscribe((response) => {
    //   this.isCompanySelected = response;
    // });
  }

  ngOnInit() {
  }

  // checkPermission(module, action = "list") {
  //   const perm_module = this.permission[module];
  //   return (perm_module != undefined && (perm_module[action] !== undefined && perm_module[action] === true) || false);
  // }

  onLogOut() {
    this.dataService.purgeAuth();
    this.router.navigateByUrl('/login');
    window.location.reload();
    this.commonService.logout(this.currentUserDetail.refreshToken.token).subscribe(
      async (response) => {
        // await this.dataService.purgeAuth();
        // await this.router.navigateByUrl('/login');
        // window.location.reload();
      }, async (err) => {
        // await this.dataService.purgeAuth();
        // await this.router.navigateByUrl('/login');
        // window.location.reload();
      }
    )
  }

  ngOnDestroy(): void {

  }
}
