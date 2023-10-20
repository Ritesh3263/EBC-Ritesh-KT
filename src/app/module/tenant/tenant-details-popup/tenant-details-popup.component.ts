import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-details-popup',
  templateUrl: './tenant-details-popup.component.html',
  styleUrls: ['./tenant-details-popup.component.scss']
})
export class TenantDetailsPopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TenantDetailsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
