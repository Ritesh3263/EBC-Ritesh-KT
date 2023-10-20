import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { UserService } from 'src/app/service/user.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';
import { DistributorService } from 'src/app/service/distributor.service';
import { CommonService } from 'src/app/service/common.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-bulk-upload-user',
  templateUrl: './bulk-upload-user.component.html',
  styleUrls: ['./bulk-upload-user.component.scss']
})

export class BulkUploadUserComponent implements OnInit {

  buListArray: any;
  selectedFile: File;
  addForm: FormGroup;
  downloadTemplateLink: any = '';
  currentUser: any;
  searchFilterBU: any = null;
  licenseListArray: any = [];
  platinum: any = null;
  gold: any = null;
  standard: any = null;
  currentTenant: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private businessUnitService: BusinessUnitService,
    private userService: UserService,
    private dataService: DataService,
    public dialog: MatDialog,
    private distributorService: DistributorService,
    private commonService: CommonService
  ) {
    this.addForm = this.fb.group({
      code: [null, Validators.compose([Validators.required])],
      file: [null, Validators.compose([Validators.required])],
      file_name: [null, Validators.compose([Validators.required])],
    });
    this.dataService.currentUser.subscribe((data) => {
      if (data) { this.currentUser = data; this.getLicenseType(); }
    })
    this.dataService.currentTenant.subscribe((data) => {
      if (data) { this.currentTenant = data.data; this.getLicenseType(); }
    })
  }

  ngOnInit() {
      this.refreshPage();
  }

  getBUData(Ids) {
    let filters = [];
    if(Ids.length > 0) {
      Ids.map((data) => {
        filters.push({ "propertyName": "Code", "value": data, "caseSensitive": true })
      });
      this.searchFilterBU = { "conditionOperator": 1, "filters": filters }
    }
    
    this.businessUnitService.getBusinessUnitList({
      "searchFilter": this.searchFilterBU,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res) {
        this.buListArray = res.data;
        if (this.buListArray.length > 0) {
          this.addForm.get('code').setValue(this.buListArray[0].code);
          this.onBUChange();
        }
      }
    });
  }

  fileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(csv|CSV)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.warning('Please select valid file');
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedFile = fileInputFile.target.files[0];
      this.addForm.get('file_name').setValue(this.selectedFile.name);
      this.addForm.get('file').setValue(this.selectedFile);
    }
  }

  removeFile() { this.selectedFile = null; }

  onBUChange() {
    this.buListArray.map((data) => {
      if (data.code == this.addForm.value.code) {
        this.downloadTemplateLink = 'https://ebcblob.blob.core.windows.net/devebc/User-bulkupload.csv'
        // data.csvTemplate;
      }
    })
  }

  submitForm() {
    if (this.addForm.valid) {
      const data = new FormData();
      data.append('file', this.selectedFile);
      // data.append('code', this.addForm.value.code);
      this.userService.fileUpload(data, { 'code': this.addForm.value.code }).subscribe((res) => {
        // this.dialog.open(SuccessPopupComponent, {
        //   // width: '300px',
        //   data: { defaultValue: res, callback: 'bulkUpload' }
        // });
        this.router.navigateByUrl('/user')
      }, (err) => {
        this.toastService.error(err.error.message);
      })
    }
  }

  getLicenseType() {
    this.distributorService.GetLicensorBalanceById(this.currentTenant.id).subscribe((res) => {
      this.licenseListArray = res.data;
      this.calculateCount();
    })

  }

  calculateCount() {
    this.licenseListArray.map((data) => {
      switch (String(data.licenseType).toLowerCase()) {
        case 'standard':
          this.standard = data;
          break;
        case 'gold':
          this.gold = data;
          break;
        case 'platinum':
          this.platinum = data;
          break;
      }
    })
  }

  refreshPage() {
    this.commonService.GetCurrentUserProfile().subscribe((response) => {
      if (response) {
        this.getBUData(response.user.businessUnitIds);
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  ngOnDestroy(): void {

  }
}
