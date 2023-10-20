import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';

@AutoUnsubscribe()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']

})
export class ProfileComponent implements OnInit {

  PageTitle = "Profile"
  currentUser: any;
  permissionObject: any = null;
  permissionCode = permission;

  constructor(
    private dataservice: DataService
  ) {
    this.dataservice.permission.subscribe((response) => {
      this.permissionObject = response;
    });
  }

  ngOnInit(): void {
    this.dataservice.currentUser.subscribe((responce) => {
      if (responce) {
        this.currentUser = responce;
      }
    });
  }
  ngOnDestroy(): void {  }
}
