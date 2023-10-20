import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'src/app/service/pagination.service';
import { TenantService } from 'src/app/service/tenant.service';
import { TenantDetailsPopupComponent } from '../tenant-details-popup/tenant-details-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment';
import { permission } from 'src/app/shared/permission';
import { DataService } from 'src/app/service/data.service';
import { ToastrService } from 'ngx-toastr';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit {
  displayedColumns: string[] = ['companyName', 'email', 'country', 'usedLicense', 'totalLicense', 'status'];
  filterColumns: string[] = ['CompanyName', 'PrimaryEmailId', 'Country'];

  action: any;
  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  permissionObject: any = null;
  showPagination: boolean = false;
  currentPageLimit: number = environment.defaultPageLimit;
  tierListArray: any = [];
  permissionCode = permission;
  searchFilter: any = {};
  isShort: any = false;
  sortFieldName: any;

  constructor(
    private paginationService: PaginationService,
    private tenantService: TenantService,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private dataService: DataService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
      if (this.permissionObject?.includes(this.permissionCode?.updateTenant) || this.permissionObject?.includes(this.permissionCode?.deleteTenant))
        this.displayedColumns.push('action');
    });
  }

  ngOnInit() {
    // this.getMasterData();
    this.getObjects();

  }
  getMasterData() {
    this.tenantService.getTiers({
      "searchFilter": null,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res) {
        this.tierListArray = res.data;
        this.dataService.tierListArraySubject.next(this.tierListArray)
        this.getObjects();
      }
    });
  }

  getObjects() {
    const params: any = {
      page: this.currentPage,
      pageSize: this.currentPageLimit,
      fields: null
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
    this.objectArray = [];
    this.tenantService.getTenantList(params).subscribe((response) => {
      this.loadingState = false;
      if (response) {
        // let tempObjectArray = response.data;
        // let tempArray: any = []
        // tempObjectArray.map((data) => {
        //   this.tierListArray.map((tire) => {
        //     if (tire?.id && data?.tierId && tire?.id == data?.tierId) { tempArray.push({ ...data, licenseCount: tire.licenseCount }) }
        //   })
        // })
        this.objectArray = response.data;
        this.showPagination = true;
        this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);

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

  searchObject(text) {
    this.searchText = text;
    this.currentPage = 1;
    let filters = [];
    for (let index = 0; index < this.filterColumns.length; index++) {
      const element = this.filterColumns[index];
      filters.push({
        "propertyName": element,
        "value": this.searchText.toLowerCase(),
        "caseSensitive": true,
        "operator": 5,
      })
    }
    this.searchFilter = { "conditionOperator": 1, filters: filters };
    this.getObjects();
  }

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '390px',
      data: { ...data, name:data.companyName, isDelete: true },
      panelClass: 'delete-popup'

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.tenantService.deleteUser(result.id).subscribe((res) => {
          if (res.status = "Ok") {
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback: "deleteRecord" }
            });
            this.getObjects();
          }
          else {
            // this.toastrService.error(res.message);
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res }
            });
          }
        }, (err) => {
          // this.toastrService.error(err.error.message);
          this.dialog.open(SuccessPopupComponent, {
            data: { defaultValue: err.error }
          });
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
  viewDialog(data: any): void {
    const dialogRef = this.dialog.open(TenantDetailsPopupComponent, {
      width: '855px',
      height: '676px',
      data: data,
      panelClass: 'tenant-popup'

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  suspendTenantById(data: any): void {
    if (this.permissionObject?.includes(this.permissionCode?.updateTenant)) {
      const dialogRef = this.dialog.open(ActionPopupComponent, {
        width: '683px',
        height: '390px',
        data: { ...data, isDelete: false, isSuspend: true, suspendFlag: !data.isDeleted, name: data.companyName },
        panelClass: 'delete-popup'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.is_delete) {
          this.tenantService.suspendTenantById(result.id).subscribe((res) => {
            this.getObjects();
            if (res) {
              this.dialog.open(SuccessPopupComponent, {
                data: { defaultValue: res }
              });
            }
          })
        }
      });

    }
  }
}
