import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { ApprovalService } from 'src/app/service/approval.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-done',
  templateUrl: './approval-done.component.html',
  styleUrls: ['./approval-done.component.scss']
})
export class ApprovalDoneComponent implements OnInit {

  showPagination: boolean = false;
  isLoading = false;
  currentUser : any= [];
  approvalList = [];
  pagination: any;
  currentPage: any = 1;
  currentPageLimit: number = environment.defaultPageLimit;

  constructor(private dialog: MatDialog, private approvalService: ApprovalService, private dataService: DataService, private paginationService: PaginationService) { 
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
      if(this.currentUser) {
        this.getApprovedList();
      }
    });
  }

  ngOnInit(): void {
    
  }

  getApprovedList() {
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
    this.approvalService.getApprovedList(data).subscribe((res) => {
      this.isLoading = false;
      this.approvalList = res.data;
      this.showPagination = this.approvalList.length > 0 ? true : false;
      this.pagination = this.paginationService.getPager(res['recordCount'], this.currentPage, this.currentPageLimit);
    }, (err) => { this.isLoading = false;
      this.showPagination = false })
  }

  getPage(data: any) {
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getApprovedList();
  }

  open(reason) {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '420px',
      data: { approval: true, reason: reason},
      panelClass: 'delete-popup'
    });
  }
}
