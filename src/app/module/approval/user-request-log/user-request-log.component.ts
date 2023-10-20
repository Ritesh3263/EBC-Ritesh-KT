import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { ApprovalService } from 'src/app/service/approval.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-request-log',
  templateUrl: './user-request-log.component.html',
  styleUrls: ['./user-request-log.component.scss']
})
export class UserRequestLogComponent implements OnInit {
    showPagination: boolean = false;
    isLoading = false;
    currentUser : any= [];
    logList = [];
    pagination: any;
    currentPage: any = 1;
    currentPageLimit: number = environment.defaultPageLimit;
    sortFieldName: any;
    isSort: any;
  
    constructor(private dialog: MatDialog, private approvalService: ApprovalService, private dataService: DataService, private paginationService: PaginationService) { 
      this.dataService.currentUser.subscribe((response) => {
        this.currentUser = response;
        if(this.currentUser) {
          this.getRequestLogList();
        }
      });
    }
  
    ngOnInit(): void {}
  
    getRequestLogList() {
      this.isLoading = true;
      
      let data = {
        "searchFilter": {
          "conditionOperator": 0,
          "filters": []
        },
        "sortElement": {},
        "page": this.currentPage,
        "pageSize": this.currentPageLimit,
        "fields": []
      }

      if (this.sortFieldName) {
        data.sortElement = {
          "propertyName": this.sortFieldName,
          "sortOrder": this.isSort ? 1 : -1
        }
      }
      this.approvalService.getRequestLogsList(data).subscribe((res) => {
        this.isLoading = false;
        this.logList = res.data;
        this.showPagination = this.logList.length > 0 ? true : false;
        this.pagination = this.paginationService.getPager(res['recordCount'], this.currentPage, this.currentPageLimit);
      }, (err) => { this.isLoading = false;
        this.showPagination = false })
    }
  
    getPage(data: any) {
      this.currentPage = data.page;
      this.currentPageLimit = data.limit;
      this.getRequestLogList();
    }
  
    open(reason) {
      const dialogRef = this.dialog.open(ActionPopupComponent, {
        width: '683px',
        height: '420px',
        data: { approval: true, reason: reason},
        panelClass: 'delete-popup'
      });
    }

    sortData(name) {

      this.isSort = !this.isSort;
      this.sortFieldName = name;
      this.getRequestLogList();
    }
}
