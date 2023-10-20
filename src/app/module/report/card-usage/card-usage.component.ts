import { I } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportsService } from 'src/app/service/reports.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-usage',
  templateUrl: './card-usage.component.html',
  styleUrls: ['./card-usage.component.scss']
})
export class CardUsageComponent implements OnInit {
  
  currentPageLimit: number = environment.defaultPageLimit;
  currentPage: any = 1;
  pagination: any = null;
  currentUser: any;
  sortFieldName: any;
  selectedBU = [];
  searchText: any = null;
  searchFilter: any = {};
  loadingState = true;
  objectArray: Array<any> = [];
  isDownload: boolean = false;
  startDate : any;
  endDate: any = new Date().toISOString();
  isSort: any;
  filterColumns: any = [];
  buList = [];
  totalView = 0;

  constructor(
    private dataService: DataService,
    private reportsService: ReportsService,
    private paginationService: PaginationService,
  ) { 
    this.getbuList();
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
      if(this.currentUser.userType == 'Tenant Admin') {
        this.filterColumns = ['User', 'No of Views', 'BU']
      } else {
        this.filterColumns = ['User', 'No of Views']
      }
    });

  }

  ngOnInit(): void { 
    this.getObjects();
  }

  getObjects() {
    const params: any = {
      fields: null,
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };

    let buList: any = [];

    this.selectedBU.map((cmp) => {
        buList.push(
          {
            "propertyName": "bu",
            "operator": 0,
            "value": cmp,
            "dataType": "string",
            "caseSensitive": true
          }
        )
    })

    if (this.sortFieldName) {
      params.sortElement = {
        "propertyName": this.sortFieldName,
        "sortOrder": this.isSort ? 1 : -1
      }
    }
    if (this.selectedBU.length > 0) {
      params.searchFilter = {
        conditionOperator: 0,
        filters: buList
      }
    }

    this.reportsService.getCardUsage(params, this.isDownload).subscribe((response) => {
      this.loadingState = false;
      this.totalView = response.miscData;
      if (response.data && !this.isDownload) {
        this.objectArray = response.data;
        if(response.data.length > 0) {
          this.pagination = this.paginationService.getPager(response['recordCount'], this.currentPage, this.currentPageLimit);
        }
      } else if(response.data && this.isDownload) {
        window.location.href = response.data;
        this.isDownload = false;
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

  // searchObject(text) {
  //   this.searchText = text;
  //   this.currentPage = 1;
  //   let filters = [];
  //   for (let index = 0; index < this.filterColumns.length; index++) {
  //     const element = this.filterColumns[index];
  //     filters.push({
  //       "propertyName": element,
  //       "value": this.searchText,
  //       "caseSensitive": true,
  //       "operator": 5,
  //     })
  //   }
  //   this.searchFilter = { "conditionOperator": 1, filters: filters };
  //   this.getObjects();
  // }

  sortData(name) {
    this.isSort = !this.isSort;
    if(name == 'No of Views') {
      this.sortFieldName = 'count';
    } else if(name == 'User') {
      this.sortFieldName = '_id';
    } 
    
    this.getObjects();
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getObjects();
  }

  onDownload(){
    this.isDownload = true;
    this.getObjects();
  }

  reset() {
    this.selectedBU = [];
    this.getObjects();
  }

  getbuList() {
    this.reportsService.getbuList().subscribe((res) => {
      this.buList = res.data
    })
  }

}
