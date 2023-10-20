import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { DistributorService } from 'src/app/service/distributor.service';
import { TenantService } from 'src/app/service/tenant.service';
import { UserService } from 'src/app/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { countRegEx } from 'src/app/shared/common';

@Component({
  selector: 'app-renewal-tenant',
  templateUrl: './renewal-tenant.component.html',
  styleUrls: ['./renewal-tenant.component.scss']
})
export class RenewalTenantComponent implements OnInit {

  licenseForm: FormGroup;
  showLoader = false;
  tierListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  tenantDetails: any;
  objectArray: any = [];
  currentUser: any;
  licenseListArray: any = [];
  selectedLicense: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private tenantService: TenantService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private distributorService: DistributorService,
    public dialog: MatDialog,

  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
    }

    const validTo = new Date(); validTo.setFullYear(validTo.getFullYear() + 1);
    this.licenseForm = this.fb.group({
      licenseType: [null, Validators.compose([Validators.required])],
      count: [0, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(countRegEx)])],
      validTo: [validTo],
      month: [12],
      createdBy: [],
      licensorId: [],
      licenseeId: [],
      validFrom: [new Date()],
    });

    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
        this.getLicenseType();
      }
    });
  }

  ngOnInit() {
    if (this.isEditing) {
      this.getEditObject()
    }
  }

  getLicenseType() {
    this.distributorService.GetLicensorBalanceById(this.currentUser.id).subscribe((res) => {
      this.licenseListArray = res.data;
      this.selectedLicense = this.licenseListArray[0];
    })
  }

  getEditObject() {
    this.tenantService.getTenantById({ id: this.editId }).subscribe((response) => {
      if (response && response.data) {
        this.tenantDetails = response.data;
      } else {
        this.router.navigateByUrl('/tenant');
      }
    });
    this.distributorService.getRenewedLicenses(this.editId).subscribe((response) => {
      if (response) {
        this.objectArray = response.data;
        this.objectArray.forEach(e => {
          e.isChecked = false;
        });
      }
    });

  }

  async submitForm() {
    if (this.objectArray.length == 0) {
      this.toastService.error('Please add license');
      return;
    }
    let data = [];
    this.objectArray.map((item) => {
      let t = {
        ...item,
        createdBy: this.currentUser.emailId,
        licensorId: this.currentUser.id,
        licenseeId: this.tenantDetails.id,
        userType: "Tenant Admin",
        tenantCode: this.tenantDetails['code']
      };
      delete t.month;
      delete t.validTo;
      data.push(t);
    })
    this.distributorService.renewLicense(data).subscribe((data) => {
      if (data.status = 'Ok') {
        this.showLoader = false;
        this.router.navigateByUrl('/tenant');
      }
    })
  }

  isAutofocus = false;
  onLicenseChange() {
    this.isAutofocus = true;
    this.licenseForm.patchValue({ count: 0 });
    this.licenseListArray.map((data) => {
      if (this.licenseForm.value['licenseType'] == data.licenseType) {
        this.selectedLicense = data;
        this.licenseForm.patchValue({ count: 0 })
        this.licenseForm.controls["count"].setValidators([Validators.required, Validators.min(1), Validators.max(this.selectedLicense.availableCount), Validators.pattern("^[0-9]*$")]);
        this.licenseForm.get('count').updateValueAndValidity();
      }
    })
  }

  addLicense() {
    let tempCount = 0
    for (let index = 0; index < this.objectArray.length; index++) {
      const item = this.objectArray[index];
      if ((String(item.licenseType).toLowerCase()) === (String(this.licenseForm.value.licenseType).toLowerCase())) {
        tempCount = tempCount + item.count;
      }
    }
    tempCount = tempCount + this.licenseForm.value.count

    if (this.licenseForm.valid) {
      if (tempCount <= this.selectedLicense.totalCount && this.selectedLicense.availableCount - this.licenseForm.value.count >= 0) {
        this.selectedLicense.availableCount = this.selectedLicense.availableCount - this.licenseForm.value.count;
        let flag = true;

        if (flag) {
          if (this.objectArray.length == 0) {
            let y = new Date(this.licenseForm.value.validTo).getFullYear() - new Date(this.licenseForm.value.validFrom).getFullYear();
            let m = new Date(this.licenseForm.value.validTo).getMonth() - new Date(this.licenseForm.value.validFrom).getMonth();
            this.objectArray.push({ ...this.licenseForm.value, month: m + (y * 12) });
          } else {
            let y = new Date(this.objectArray[0].validTo).getFullYear() - new Date(this.objectArray[0].validFrom).getFullYear();
            let m = new Date(this.objectArray[0].validTo).getMonth() - new Date(this.objectArray[0].validFrom).getMonth();
            this.objectArray.push({ ...this.licenseForm.value, month: m + (y * 12), validTo: this.objectArray[0].validTo });
            this.objectArray.forEach(e => {
              if (e.hasOwnProperty('createdBy')) {
                if (e.licenseType == "Standard")
                  e.uniqueId = 1;
                if (e.licenseType == "Gold")
                  e.uniqueId = 2;
                if (e.licenseType == "Platinum")
                  e.uniqueId = 3;
              }
            });

            //sort uniqueId
            for (let i = 0; i < this.objectArray.length; i++) {
              for (let j = i + 1; j < this.objectArray.length; j++) {
                let temp = 0;
                if (this.objectArray[j].uniqueId < this.objectArray[i].uniqueId) {
                  // Swapping
                  temp = this.objectArray[i];
                  this.objectArray[i] = this.objectArray[j];
                  this.objectArray[j] = temp;
                }
              }
            }
          }
          this.objectArray.forEach(e => {
            if (e.licenseType == "Gold") e.temp = 1
            if (e.licenseType == "Platinum") e.temp = 2
            if (e.licenseType == "Standard") e.temp = 0;
          });
        }

      } else {
        this.toastService.warning('Invalid License Count!')
      }
    }
    // this.calculateCount();
  }

  onDelete(i,) {
    this.objectArray.splice(i, 1);
  }

  countUpdate(type) {
    let count = this.licenseForm.value.count;
    if (type == '+') {
      (this.selectedLicense?.availableCount > this.licenseForm.value.count) ? count++ : ''
    } else if (type == '-') {
      (0 < this.licenseForm.value.count) ? count-- : '';
    }
    this.licenseForm.patchValue({ count: count })
  }
}
