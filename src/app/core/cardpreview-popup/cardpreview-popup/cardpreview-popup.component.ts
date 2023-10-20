import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cardpreview-popup',
  templateUrl: './cardpreview-popup.component.html',
  styleUrls: ['./cardpreview-popup.component.scss']
})
export class CardpreviewPopupComponent implements OnInit {
  isFlip: boolean = false;
  isEdit: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<CardpreviewPopupComponent>
  ) {

  }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close(false);
  }
}
