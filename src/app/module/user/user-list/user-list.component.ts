import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { Router } from '@angular/router';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { CommonService } from 'src/app/service/common.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { permission } from 'src/app/shared/permission';
import { DataService } from 'src/app/service/data.service';
import { RoleService } from 'src/app/service/role.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';
import { DistributorService } from 'src/app/service/distributor.service';
@AutoUnsubscribe()
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [];
  filterColumns: string[] = ['FirstName', 'EmailId', 'Role', 'LastName', 'FullName'];

  action: any;
  loadingState = true;
  objectArray: any = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  permissionCode = permission;
  searchFilter: any = {};
  currentUser: any;
  currentTenant: any;
  showLoader: any;
  isShort: any = false;
  sortFieldName: any;
  dialogRef: any;
  licenseListArray = [];
  licenseType = ''

  constructor(
    private paginationService: PaginationService,
    private userService: UserService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private dataService: DataService,
    private distributorService: DistributorService
  ) {
    this.userService.showMasterLoader.subscribe((res) => {
      this.showLoader = res;
  });
    this.dataService.currentTenant.subscribe((tenant) => { 
      if (tenant) {
        this.currentTenant = tenant;
        this.getLicenseType();
        
      }
       });

    this.dataService.currentUser.subscribe((res) => {
      if (res) {
        this.currentUser = res;
        if (this.currentUser?.userType == 'Tenant Admin' || this.currentUser?.userType == 'BU Admin') {
          this.displayedColumns = ['firstName', 'lastName', 'emailID', 'role', 'businessUnitIds'];
        } else {
          this.displayedColumns = ['firstName', 'lastName', 'emailID', 'role'];
        }
      }
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
      if (this.permissionObject?.includes(this.permissionCode?.updateUser) || this.permissionObject?.includes(this.permissionCode?.deleteUser)) {
        if (this.displayedColumns.indexOf('action') === -1) {
          // this.displayedColumns.push('action');
          this.displayedColumns.splice(0, 0, "action");
        }
      }
    });
  }

  ngOnInit() {

    this.getObjects();
    if(this.showLoader) {
      const task = setInterval(() => {
        this.userService.getBulkUploadStatus().subscribe((resp) => {
          if(resp.data.statusFront == true && resp.data.status == 'Error') {
            if(this.dialog.openDialogs || this.dialog.openDialogs.length > 0) {
              this.dialog.closeAll();
            }
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: resp.data, callback: 'bulkUploadError' }
             });
            this.userService.loaderSubject.next(false);
            this.userService.showMasterLoader.subscribe((res) => {
              this.showLoader = res;
          });
          this.showLoader = false
          } else if(resp.data.statusFront == true && resp.data.status == 'Ok') {
            this.userService.loaderSubject.next(false);
              this.userService.showMasterLoader.subscribe((res) => {
                  this.showLoader = res;
              });
              this.showLoader = false;
            if(this.dialog.openDialogs.length > 0) {
              this.dialog.closeAll();
            }
            if(resp.data.existingUserCount != 0 && resp.data.addedCount == 0) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadExisting' }
              });
            } else if(resp.data.existingUserCount != 0 && resp.data.addedCount != 0) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadPartialExisting' }
              });
            } else if(resp.data.existingUserCount == 0 && resp.data.addedCount > 0){
              this.dialog.open(SuccessPopupComponent, {
                data: { defaultValue: resp.data, callback: 'bulkUploadAll' }
               });
            } else if(resp.data.existingUserCount == 0 && resp.data.addedCount == 0) {
              this.dialog.open(SuccessPopupComponent, {
               data: { defaultValue: resp.data, callback: 'bulkUploadNoData' }
              });
            }
          this.getObjects();
          } else if(resp.data.statusFront == false) {
            this.userService.loaderSubject.next(true);
            this.userService.showMasterLoader.subscribe((res) => {
              this.showLoader = res;
          });
          if(this.dialog.openDialogs || this.dialog.openDialogs.length > 0) {
            this.dialog.closeAll();
          }
          this.showLoader = true
          }
          if(!this.showLoader) {
            clearInterval(task);
          }
          },
          (err) => {

          }
          
        )
      }, 2000);
    }
  }

  getObjects() {
    const params: any = {
      sortElement: {
        propertyName: "CreatedDate",
        sortOrder: -1
      },
      page: this.currentPage,
      pageSize: this.currentPageLimit
    };

    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isShort ? 1 : -1
      }
    }

    if (this.searchText) {
      params.searchFilter = this.searchFilter;
    }
    if (this.licenseType) {
      params.searchFilter = this.searchFilter;
    }
    this.userService.getUserList(params).subscribe((response) => {
      this.loadingState = false;
      if (response) {
        let temp: any = []; let data = response.data; let flag = 0;
        data.map((res) => {
          if (res?.emailId != this.currentUser?.emailId) temp.push(res);
          else flag = 1;
        })
        this.objectArray = temp;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(response['recordCount'] + flag, this.currentPage, this.currentPageLimit);
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.pagination = null;
    });
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getObjects();
  }

  searchObject(text, type) {
    this.currentPage = 1;
      let filters = [];
    if(type == 'search') {
      this.searchText = text;
      for (let index = 0; index < this.filterColumns.length; index++) {
        const element = this.filterColumns[index];
        filters.push({
          "propertyName": element,
          "value": this.searchText.toLowerCase(),
          "caseSensitive": true,
          "operator": 5,
        })
      }
    } else {
      if(this.licenseType) {
        filters.push({
          "propertyName": 'LicenseType',
          "value": this.licenseType.toLowerCase(),
          "caseSensitive": true,
          "operator": 5,
        })
      }
    }
    this.searchFilter = { "conditionOperator": 1, filters: filters };
    this.getObjects();
  }

  onDelete(data: any): void {
    this.dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '400px',
      data: { defaultValue: data, isDelete: true },
      panelClass: 'delete-popup'

    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.userService.deleteUser(data.id).subscribe((res) => {
          if (res.status = "Ok") {
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback: 'deleteRecord' }
            });
            this.getObjects();
          }
          else {
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback: 'deleteRecord' }
            });
            // this.toastrService.error(res.message);
          }
        }, (err) => {
          this.dialog.open(SuccessPopupComponent, {
            data: { defaultValue: err.error }
          });
          // this.toastrService.error(err.error.message);
        })
      }
    });
  }
  sortData(name) {

    // Frontend Short
    // this.commonService.isShort = !this.commonService.isShort
    // this.objectArray = this.commonService.sortData(name, this.objectArray);

    // Backend Short
    this.isShort = !this.isShort;
    this.sortFieldName = name;
    this.getObjects();
  }

  onPreview(item) {
    let url = `${environment.frontEndURL}end-user?tc=${btoa(this.currentTenant.data.code)}&em=${btoa(item.emailId)}`;
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  getLicenseType() {
    this.distributorService.GetLicensorBalanceById(this.currentTenant.data.id).subscribe((res) => {
      this.licenseListArray = res.data;
    })
  }

  reset() {
    this.licenseType = '';
    this.searchText = '';
    this.getObjects()
  }

  ngOnDestroy(): void { }
}
