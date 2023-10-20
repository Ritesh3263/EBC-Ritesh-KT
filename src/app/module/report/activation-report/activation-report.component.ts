import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { ReportsService } from 'src/app/service/reports.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-activation-report',
  templateUrl: './activation-report.component.html',
  styleUrls: ['./activation-report.component.scss']
})
export class ActivationReportComponent implements OnInit {

  filterColumns: any[];
  currentPageLimit: number = environment.defaultPageLimit;
  currentPage: any = 1;
  pagination: any = null;
  userTypeArray: any = []
  currentUser: any;
  sortFieldName: any;
  isShort: any = false;
  searchText: any = null;
  searchFilter: any = {};
  loadingState = true;
  objectArray: Array<any> = [];
  isDownload: boolean = false;
  userType = '';
  startDate : any;
  endDate = new Date().toISOString();

  constructor(
    private dataService: DataService,
    private reportsService: ReportsService,
    private paginationService: PaginationService,
    private datepipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.startDate = new Date(new Date().getFullYear(), (new Date().getMonth() - 1), 1);
    this.getUserType();
  }

  getObjects() {
    const params: any = {
      fields: null,
      page: this.currentPage,
      pageSize: this.currentPageLimit,
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

    let sdate: any = new Date(this.startDate);
    sdate = sdate.getFullYear() + '-' + (sdate.getMonth()+1) + '-' + (sdate.getDate()+1);
    sdate = new Date(sdate).toISOString();
    let edate : any = new Date(this.endDate);
    edate = new Date(edate.getFullYear() + '-' + (edate.getMonth()+1) + '-' + (edate.getDate()+1));
    edate = new Date(edate).toISOString();

    this.reportsService.getActiveReports(params, this.userType, this.isDownload, sdate, edate).subscribe((response) => {
      this.loadingState = false;
      if (response.data && !this.isDownload) {
        this.objectArray = response.data;
        this.objectArray.forEach(el => {
          el.lastActivationDate = this.datepipe.transform(new Date(el.lastActivationDate), 'dd-MM-yyyy');
          el.lastAllocationDate = this.datepipe.transform(new Date(el.lastAllocationDate), 'dd-MM-yyyy');
        })
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

  getUserType() {
    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        if (this.currentUser.userType == "Super Admin") {
          this.userType = 'Distributor';
          this.userTypeArray = [
            {
              name: "Distributor"
            },
            {
              name: "Reseller"
            },
            {
              name: "Tenant Admin"
            }
          ];
        } else if (this.currentUser.userType == "Distributor") {
          this.userType = 'Reseller';
          this.userTypeArray = [
            {
              name: "Reseller"
            },
            {
              name: "Tenant Admin"
            }
          ];
        } else if (this.currentUser.userType == "Reseller") {
          this.userType = 'Tenant Admin';
          this.userTypeArray = [
            {
              name: "Tenant Admin"
            }
          ];
        }
        if(this.userType == 'Distributor' || this.userType == 'Reseller') {
          this.filterColumns = ['Name', 'Email', 'Country', 'Total allocated licenses', 'Total activated licenses', 'Total available licenses', 'Last allocation Date(Latest)', 'Last activation Date(Latest)', 'User Status',
          'Created Date'];
        } else {
          this.filterColumns = this.filterColumns = ['Name', 'Email', 'Total allocated licenses', 'Total activated licenses', 'Total available licenses', 'Last allocation Date(Latest)', 'Last activation Date(Latest)', 'User Status',
          'Created Date'];
        }
        this.getObjects();
      }
    })
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getObjects();
  }

  onSelectedUserType(userType) {
    this.userType = userType.value;
    if(this.userType == 'Distributor' || this.userType == 'Reseller') {
      this.filterColumns = ['Name', 'Email', 'Country', 'Total allocated licenses', 'Total activated licenses', 'Total available licenses', 'Last allocation Date(Latest)', 'Last activation Date(Latest)', 'User Status',
      'Created Date'];
    } else {
      this.filterColumns = ['Name', 'Email', 'Total allocated licenses', 'Total activated licenses', 'Total available licenses', 'Last allocation Date(Latest)', 'Last activation Date(Latest)', 'User Status',
      'Created Date'];
    }
    this.getObjects();
  }

  onDownload(){
    this.isDownload = true;
    this.getObjects();
  }

  reset() {
    this.endDate = new Date().toISOString();
    this.startDate = new Date(new Date().getFullYear(), (new Date().getMonth() - 1), 1).toISOString();
    this.isDownload = false;
    this.getUserType();
  }

  dateChange() {
    this.startDate = new Date(this.startDate).toISOString();
    this.endDate = new Date(this.endDate).toISOString();
    this.getObjects();
  }

}
