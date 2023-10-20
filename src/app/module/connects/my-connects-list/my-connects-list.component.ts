import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { PaginationService } from 'src/app/service/pagination.service';
import { ConnectsService } from 'src/app/service/connects.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
import { VCard } from 'ngx-vcard/ngx-vcard';

@Component({
  selector: 'app-my-connects-list',
  templateUrl: './my-connects-list.component.html',
  styleUrls: ['./my-connects-list.component.scss']
})
export class MyConnectsListComponent implements OnInit {

  loadingState = true;
  objectArray: Array<any> = [];
  pagination: any = null;
  searchText: any = null;
  currentPage: any = 1;
  permissionObject: any = null;
  permissionCode = permission;
  showPagination: boolean = false;
  currentPageLimit: number = environment.defaultPageLimit;
  filterColumns: string[] = ['address', 'companyName', 'email', 'name', 'mobileNumber', 'contactOwnerEmail', 'contactOwnerName', 'designation'];
  searchFilter: any = {};
  companies: any[] = [];
  cardDetails: any[] = [];
  selectedCompany: any = [];
  selectedItemDetail: any = [];
  currentUser: any;

  constructor(
    private paginationService: PaginationService,
    private connectsService: ConnectsService,
    private router: Router,
    private dataService: DataService
  ) {
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });
   }

  ngOnInit() {
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
    });
    this.getObjects();
    this.getCompanies();
  }

  getCompanies() {
    this.connectsService.getCompanies({ currentUser: true }).subscribe((data) => {
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
    this.connectsService.getBusinessCards({ currentUser: true }, params).subscribe((response) => {
      this.loadingState = false;
      if (response) {
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
    let url = `${environment.frontEndURL}end-user?tc=${btoa(item.companyName)}&em=${btoa(item.email)}`;
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }

  saveContact(item, index) {
    this.selectedItemDetail = item;
    document.getElementById('carddown2_'+index).click();
  }

  public generateVCardOnTheFly = (): VCard => {
    // TODO: Generate the VCard before Download
    let telePhone = [];
    if (this.selectedItemDetail?.mobileNumber) {
      telePhone.push({
        value: this.selectedItemDetail?.mobileNumber,
        param: { type: ['mobile'], value: 'uri' },
      })
    }
    return {
      version: '3.0',
      name: {
        firstNames: this.selectedItemDetail?.name, lastNames: ''
      },
      organization: this.selectedItemDetail?.companyName,
      title: this.selectedItemDetail?.designation,
      email: [this.selectedItemDetail?.email],
      telephone: telePhone,
    };
  };
}
