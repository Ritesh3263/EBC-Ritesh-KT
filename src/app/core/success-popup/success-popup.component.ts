import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export type DialogDataSubmitCallback<T> = (row: T) => void;
import { ngxCsv } from 'ngx-csv';


@Component({
  selector: 'app-success-popup',
  templateUrl: './success-popup.component.html',
  styleUrls: ['./success-popup.component.scss']
})

export class SuccessPopupComponent implements OnInit {
  receivedData:any='';
  addressDelete:any='';
  userListData: any = '';
  buDelete:any='';
  existingData = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { callback: any; defaultValue: any },
    private dialogRef: MatDialogRef<SuccessPopupComponent>
  ) {
  } 

  ngOnInit(): void {
    if (this.data.defaultValue) {
      if (this.data.callback == "deleteAddressOk"){
        this.addressDelete = this.data.defaultValue;
      }
      else if (this.data.callback == "deleteBUOk"){
        this.buDelete = this.data.defaultValue;
      }
      else if (this.data.callback == "bulkUploadExisting" || this.data.callback == "bulkUploadPartialExisting"){
        this.userListData = this.data.defaultValue;
          this.userListData.existingUserList.forEach(element => {
            this.existingData.push({email: element})
          });
      } 
      else {
        this.userListData = this.data.defaultValue;
      }
    }
  }

  download() {
    var options = { 
      headers: ["Duplicate Email"]
    };
    new ngxCsv(this.existingData, 'My Report', options);
  }

  close() {
    this.dialogRef.close(false);
  }
}
