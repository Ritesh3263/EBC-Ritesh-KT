import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { CommonService } from 'src/app/service/common.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ResellerService } from 'src/app/service/reseller.service';
import { environment } from 'src/environments/environment';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-reseller-list',
  templateUrl: './reseller-list.component.html',
  styleUrls: ['./reseller-list.component.scss']
})
export class ResellerListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'emailId', 'country', 'primaryContact', 'usedLicense', 'totalLicense', 'status'];
  filterColumns: string[] = ['firstName', 'lastName', 'fullName', 'emailId', 'country', 'primaryContact'];
  action: any;
  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  currentPageLimit = environment.defaultPageLimit;
  permissionObject: any = null;
  showPagination: boolean = false;
  searchFilter: any = {};
  permissionCode = permission;

  isShort: any = false;
  sortFieldName: any;

  constructor(
    private paginationService: PaginationService,
    private resellerService: ResellerService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
      if (this.permissionObject?.includes(this.permissionCode?.updateReseller) || this.permissionObject?.includes(this.permissionCode?.deleteReseller))
        this.displayedColumns.push('action');
    });
  }

  ngOnInit() {
    this.getObjects();
  }

  getObjects() {
    const params: any = {
      fields: null,
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
    this.resellerService.getResellerList(params).subscribe((response) => {
      this.loadingState = false;
      if (response) {
        this.objectArray = response.data;
        this.objectArray.length > 0 ? this.showPagination = true : this.showPagination = false;
        this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.pagination = null;
      this.showPagination = false;
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
    this.searchFilter = { filters: filters };
    this.getObjects();
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

  onDelete(data: any): void {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '390px',
      data: { ...data, isDelete: true },
      panelClass: 'delete-popup'

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.is_delete) {
        this.resellerService.deleteReseller(result.id).subscribe((res) => {
          this.getObjects();
          if (res) {
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback: 'deleteRecord' }
            });
          }
        })
      }
    });
  }

  suspendResellerById(data: any): void {
    if (this.permissionObject?.includes(this.permissionCode?.updateReseller)) {
      const dialogRef = this.dialog.open(ActionPopupComponent, {
        width: '683px',
        height: '390px',
        data: { ...data, isDelete: false, isSuspend: true,suspendFlag:data.isActive },
        panelClass: 'delete-popup'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.is_delete) {
          this.resellerService.suspendResellerById(result.id).subscribe((res) => {
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

  ngOnDestroy(): void {

  }
}
