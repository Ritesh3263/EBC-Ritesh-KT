import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';
import { permission } from 'src/app/shared/permission';
import { DataService } from 'src/app/service/data.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AddressService } from 'src/app/service/address.service';
import { ToastrService } from 'ngx-toastr';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';

@AutoUnsubscribe()
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  displayedColumns: string[] = ['addressName', 'city', 'country'];
  filterColumns: string[] = ['AddressName', 'City', 'Country'];
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
  currentUser: any;
  isShort: any = false;
  sortFieldName: any;

  constructor(
    private paginationService: PaginationService,
    private addressService: AddressService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private dataService: DataService
  ) {
    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
      if (this.permissionObject?.includes(this.permissionCode?.updateAddress) || this.permissionObject?.includes(this.permissionCode?.deleteAddress))
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
    this.addressService.getAddressList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
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
        this.addressService.deleteAddress(result.id).subscribe((res) => {
          if (res.status == "Ok") {
            this.getObjects();
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback :'deleteAddressOk' }
            });
          }
          else {
            // this.toastrService.error(res.message);
            this.dialog.open(SuccessPopupComponent, {
              data: { defaultValue: res, callback :'deleteAddressError' }
            });
          }
        }, (err) => {
          // this.toastrService.error(err.error.message);
          this.dialog.open(SuccessPopupComponent, {
            data: { defaultValue: err.error, callback :'deleteAddressError' }
          });
        })
      }
    });
  }

  ngOnDestroy(): void { }
}
