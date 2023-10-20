import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';
import { ApprovalService } from 'src/app/service/approval.service';
import { DataService } from 'src/app/service/data.service';
import { PaginationService } from 'src/app/service/pagination.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-approval-process',
  templateUrl: './approval-process.component.html',
  styleUrls: ['./approval-process.component.scss']
})
export class ApprovalProcessComponent implements OnInit {

  showPagination: boolean = false;
  isLoading = false;
  currentUser : any= [];
  pageSize = 10;
  approvalList = [];
  pagination: any;
  currentPage: any = 1;
  currentPageLimit: number = environment.defaultPageLimit;

  constructor(private approvalService: ApprovalService, private dataService: DataService, private dialog: MatDialog, private paginationService: PaginationService) { 
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
      if(this.currentUser) {
        this.getApprovalList();
      }
    });
  }

  ngOnInit(): void {
    
  }

  getApprovalList() {
    this.isLoading = true;
    
    let data = {
      "searchFilter": {
        "conditionOperator": 0,
        "filters": []
      },
      "sortElement": {
          propertyName: "requestedDate",
          sortOrder: -1
      },
      "page": 1,
      "pageSize": this.currentPageLimit,
      "fields": []
    }
    this.approvalService.getApprovalList(data).subscribe((res) => {
      this.isLoading = false;
      this.approvalList = res.data;
      this.showPagination = this.approvalList.length > 0 ? true : false;
      this.pagination = this.paginationService.getPager(res['recordCount'], this.currentPage, this.currentPageLimit);
    }, (err) => { 
      this.isLoading = false;
      this.showPagination = false;
    })
  }

  callAction(approveEvent, userId) {
    this.isLoading = true;
    
    let data = {
      approved: approveEvent,
      approvalId: userId
    }
    this.approvalService.submitApproval(data).subscribe((res) => {
      this.isLoading = false;
      this.openPopup(approveEvent);
      this.getApprovalList();
    }, (err) => { this.isLoading = false; })
  }

  openPopup(event) {
    const dialogRef = this.dialog.open(ActionPopupComponent, {
      width: '683px',
      height: '320px',
      data: { isApproved: true, msg: (event)? 'Request Approved Successfully': 'Request Rejected Successfully', type: (event) ? 'approve' : 'reject'},
      panelClass: 'delete-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getApprovalList();
    });
  }

  getPage(data: any) { 
    this.currentPage = data.page;
    this.currentPageLimit = data.limit;
    this.getApprovalList();
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
