import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'src/app/service/pagination.service';
import { ConnectsService } from 'src/app/service/connects.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/service/common.service';
import {map, Subscription, timer} from 'rxjs';  
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
 
@AutoUnsubscribe()
@Component({
  selector: 'app-other-connects-list',
  templateUrl: './other-connects-list.component.html',
  styleUrls: ['./other-connects-list.component.scss']
})
export class OtherConnectsListComponent implements OnInit {

  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  permissionObject: any = null;
  permissionCode = permission;
  showPagination: boolean = false;
  currentPageLimit: number = environment.defaultPageLimit;
  filterColumns: string[] = ['address', 'companyName', 'email', 'designation', 'name', 'mobileNumber', 'contactOwnerEmail', 'contactOwnerName'];
  searchFilter: any = {};
  tenantCode: string;
  companies: any[] = [];
  cardDetails: any[] = [];
  selectedCompany: any = [];
  currentUser: any;
  createdBy = ['End User', 'End User', 'End User', 'End User', 'End User', 'End User', 'End User', 'End User', 'End User', 'End User']
  createdByString = '';
  timerSubscription: Subscription; 
  already_requested: any;
  
  constructor(
    private paginationService: PaginationService,
    private connectsService: ConnectsService,
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
      this.already_requested = this.currentUser?.alreadyRequested;
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });
    this.createdByString =  this.createdBy.join(",");
  }

  ngOnInit() {
    this.getObjects();
    this.getCompanies();
    this.timerSubscription = timer(0, 50000).pipe( 
      map(() => { 
        this.refreshCurrentUser(); // load data contains the http request 
      }) 
    ).subscribe(); 
  }

  refreshCurrentUser() {
    this.commonService.GetCurrentUserProfile().subscribe((response) => {
      if (response) {
        this.dataService.refreshAuth(response);
        this.already_requested = this.currentUser?.alreadyRequested;
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  open(contactOwnerName, tenantCode) {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '420px',
      data: { otherView: true, createdArray: contactOwnerName, tenantCode: tenantCode },
      panelClass: 'delete-popup'
    });
  }

  getCompanies() {
    this.connectsService.getCompanies({ currentUser: false }).subscribe((data) => {
      this.companies = data.data;
    })
  }

  getObjects() {
    let cmpList: any = [];

    this.selectedCompany.map((cmp) => {
      cmpList.push(
        {
          "propertyName": "CompanyName",
          "operator": 0,
          "value": cmp,
          "dataType": "string",
          "caseSensitive": true
        }
      )
    })
    const params: any = {
      filters: {
        fields: null,
        page: this.currentPage,
        pageSize: this.currentPageLimit,
        sortElement: {
          propertyName: "CreatedDate",
          sortOrder: -1
        },
      },

    };
    if (this.selectedCompany.length > 0) {
      params.companyFilters = {
        conditionOperator: 0,
        filters: cmpList
      }
    }
    if (this.searchText) {
      params.filters.searchFilter = this.searchFilter;
    }
    this.connectsService.getBusinessCards({ currentUser: false }, params).subscribe((response) => {
      this.loadingState = false;
      if (response) {
        this.tenantCode = response.tenantCode;
        this.objectArray = response.data;
        this.showPagination = this.objectArray.length > 0 ? true : false;
        this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);
      } else {
        this.objectArray = [];
        this.pagination = null;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = [];
      this.showPagination = false;
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

  onEdit(item) {
    this.dataService.formOCRSubject.next(item);
    this.router.navigateByUrl('/my-cards/scan-card', item.id);
  }
  onDelete(item) {

  }

  onPreview(item) {
    let url = `${environment.frontEndURL}end-user?tc=${btoa(this.tenantCode)}&em=${btoa(item.contactOwnerEmail[0])}`;
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  openDownload() {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '320px',
      data: { requestDownload: true },
      panelClass: 'delete-popup',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.already_requested = 'Already_Requested'
    });
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

  downloadForTenant() {
    const params: any = {
      filters: {
        fields: null,
        page: this.currentPage,
        pageSize: this.currentPageLimit,
        sortElement: {
          propertyName: "CreatedDate",
          sortOrder: -1
        },
      },

    };
    this.connectsService.getBusinessCards({ currentUser: false, download: true }, params).subscribe((response) => {
      if (response) {
        window.open(response.data, '_blank');
      }
    }, (error) => {
      
    });
  }
}
