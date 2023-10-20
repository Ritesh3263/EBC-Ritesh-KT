import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConnectsService } from 'src/app/service/connects.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss']
})
export class ActionPopupComponent implements OnInit {
  isDelete: boolean;
  reason: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<ActionPopupComponent>,
    private connectsService: ConnectsService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close(false);
  }

  onReasonSubmit(data) {
    this.connectsService.getRequestDownload({ reason: data }).subscribe((response) => {
      if(response.status != 'Error') {
        this.dialogRef.close(true);
      } else {
        this.toastr.error(response.message);
      }
      
    }, (error) => {
    });
  }

  onDelete() {
    this.dialogRef.close({ is_delete: true, ...this.data });

  }

  onPreview(item, i) {
    let url = `${environment.frontEndURL}end-user?tc=${btoa(this.data?.tenantCode)}&em=${btoa(this.data?.createdArray?.contactOwnerEmail[i])}`;
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  }
}
