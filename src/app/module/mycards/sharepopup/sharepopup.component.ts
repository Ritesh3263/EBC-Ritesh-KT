import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CardsService } from 'src/app/service/cards.service';
import { DataService } from 'src/app/service/data.service';
import { decryptValue, encryptValue } from 'src/app/shared/common';
import { environment } from 'src/environments/environment';
@AutoUnsubscribe()
@Component({
  selector: 'app-sharepopup',
  templateUrl: './sharepopup.component.html',
  styleUrls: ['./sharepopup.component.scss']
})
export class SharePopupComponent implements OnInit {
  addForm: FormGroup;
  qrdata = 'QR code';
  currentUser: any;

  constructor(
    public dialogRef: MatDialogRef<SharePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cardsService: CardsService,
    private toastr: ToastrService,
    private dataService: DataService
  ) {
    this.addForm = this.fb.group({
      msg: [null, Validators.compose([Validators.required])],
      emailId: [null, Validators.compose([Validators.required, Validators.email])],
      qrcode: [null, Validators.compose([Validators.required])],
    });
    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
      }
    })
  }

  ngOnInit(): void {
    let data = encryptValue(`{uid:${this.currentUser.id},emailId:${this.currentUser.emailId},tenentId:${this.currentUser.tenentId}}`)
    // let data = encryptValue(`{uid:${'61f101bb47186714d2a46e23'},emailId:${'dooi@nec.com.sg'},tenentId:${'NEC'}}`)
    this.qrdata = `${environment.frontEndURL}end-user?data=${data}`
  }

  close(): void {
    this.dialogRef.close();
  }
  submitForm(): void {
    if (this.addForm.valid) {
      this.cardsService.shareCard({ base64: this.addForm.value.qrcode },
        { emailId: this.addForm.value.emailId, msg: this.addForm.value.msg })
        .subscribe((res) => {
          this.toastr.success(res.message)
        })
    }
  }
  ngOnDestroy(): void { }
}
