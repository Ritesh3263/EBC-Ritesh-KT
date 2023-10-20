import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportsService } from 'src/app/service/reports.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-license-usage',
  templateUrl: './license-usage.component.html',
  styleUrls: ['./license-usage.component.scss']
})
export class LicenseUsageComponent implements OnInit {

  currentPageLimit: number = environment.defaultPageLimit;
  currentPage: any = 1;
  pagination: any = null;
  currentUser: any;
  sortFieldName: any;
  selectedBU = [];
  loadingState = true;
  objectArray: Array<any> = [];
  isDownload: boolean = false;
  isSort: any;
  available = 0;
  utilize = 0;
  allcoated = 0;
  buList = [];
  licenseData = [];
  constructor(
    private dataService: DataService,
    private reportsService: ReportsService,
    private paginationService: PaginationService,
    private dashboardService: DashboardService
  ) { 
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
      
    });

    this.dataService.currentTenant.subscribe((response) => {
      if (response) { 
        this.getLicenseforDashboard(response);
      }
    })

    this.getbuList();
  }

  ngOnInit(): void { 
    this.getObjects();
  }

  getbuList() {
    this.reportsService.getbuList().subscribe((res) => {
      this.buList = res.data
    })
  }

  getLicenseforDashboard(data) {
    this.dashboardService.GetLicenseforDashboard(data.data.id).subscribe((res) => {
      let tempArray = res.data;
      tempArray.forEach(element => {
        this.available += element.availableCount;
        this.allcoated += element.totalCount;
        this.utilize += element.utilizedCount;
      });
    })
  }

  getObjects() {
    const params: any = {
      fields: null,
      page: this.currentPage,
      pageSize: this.currentPageLimit,
    };

    let buList = [];
    this.selectedBU.map((cmp) => {
      buList.push(
        {
          "propertyName": "BusinessUnitIds",
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

    this.reportsService.getLicenseUsage(params, this.isDownload).subscribe((response) => {
      this.loadingState = false;
      this.licenseData = response.miscData;
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
  sortData(name) {
    this.isSort = !this.isSort;
    this.sortFieldName = name;
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

}
