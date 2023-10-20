import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { DistributorService } from 'src/app/service/distributor.service';
import { ResellerService } from 'src/app/service/reseller.service';
import { UserService } from 'src/app/service/user.service';
import { countRegEx, emailRegEx, keyPressAlpha } from 'src/app/shared/common';
@AutoUnsubscribe()
@Component({
  selector: 'app-add-reseller',
  templateUrl: './add-reseller.component.html',
  styleUrls: ['./add-reseller.component.scss']
})
export class AddResellerComponent implements OnInit {
  displayedColumns: string[] = ['license', 'count', 'startDate', 'validTo', 'month'];
  objectArray: Array<any> = [];
  loadingState = false;
  firstForm: FormGroup;
  licenseForm: FormGroup;
  activeForm = 1;
  showLoader = false;
  formErrors = { email: null, apierror: null, emailId: null, };
  licenseListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  pageTitle = "Add Reseller";
  selectedLicense: any = {};
  currentUser: any;
  platinum: any = null;
  gold: any = null;
  standard: any = null;
  currentTenant: any;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private distributorService: DistributorService,
    private resellerService: ResellerService,
    private toastService: ToastrService,
    private dataService: DataService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update Reseller' : this.pageTitle = 'Add Reseller';
    }

    this.firstForm = this.fb.group({
      firstName: [null],
      lastName: [null, Validators.compose([Validators.required])],
      country: [null, Validators.compose([Validators.required])],
      emailId: [null, Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
      primaryContact: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
    });

    this.licenseForm = this.fb.group({
      licenseType: [null, Validators.compose([Validators.required])],
      count: [0, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(countRegEx)])],
      validTo: [new Date(new Date(`${new Date().getFullYear()}-12-31`))],
      month: [12],
      createdBy: [],
      licensorId: [],
      licenseeId: [],
      validFrom: [new Date()]
    });
    //
    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;

        if (this.currentUser?.userType == 'Tenant Admin' || this.currentUser?.userType == 'BU Admin') {
          this.dataService.currentTenant.subscribe((response) => {
            if (response) {
              this.currentTenant = response;
              this.getLicenseType(this.currentTenant.data.id);
            }
          });
        } else { this.getLicenseType(this.currentUser.id); }
      }

    });

  }

  ngOnInit() {
    if (this.isEditing) {
      this.getEditObject()
    }
  }
  getLicenseType(id) {
    this.distributorService.GetLicensorBalanceById(id).subscribe((res) => {
      this.licenseListArray = res.data;
      this.selectedLicense = this.licenseListArray[0];
      this.calculateCount();
    })
  }

  onLicenseChange() {
    this.licenseListArray.map((data) => {
      if (this.licenseForm.value['licenseType'] == data.licenseType) {
        this.selectedLicense = data;
        this.licenseForm.patchValue({ count: 0 })
        this.licenseForm.controls["count"].setValidators([Validators.required, Validators.min(1), Validators.max(this.selectedLicense.availableCount), Validators.pattern("^[0-9]*$")]);
        this.licenseForm.get('count').updateValueAndValidity();
      }
    })
  }

  getEditObject() {
    this.resellerService.getResellerById(this.editId).subscribe((response) => {
      if (response) {
        this.firstForm.patchValue(response.data);
      } else {
        this.router.navigateByUrl('/reseller');
      }
    });
    this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((response) => {
      if (response) {
        this.objectArray = response.data;
      }
    });

  }

  fromChange() {
    if (this.firstForm.valid) {
      this.activeForm = 2;
    }
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
        for (let index = 0; index < this.objectArray.length; index++) {
          const item = this.objectArray[index];
          if ((String(item.licenseType).toLowerCase()) === (String(this.licenseForm.value.licenseType).toLowerCase())) {
            tempCount = tempCount + item.count;
            if ((new Date(item.validFrom).getMonth() === new Date(this.licenseForm.value.validFrom).getMonth())
              && (new Date(item.validFrom).getFullYear() === new Date(this.licenseForm.value.validFrom).getFullYear())) {

              if (this.isEditing && item.hasOwnProperty('id')) {
                flag = true;
                continue;
              } else {
                this.objectArray[index]['count'] = this.objectArray[index]['count'] + this.licenseForm.value.count;
                flag = false;
                break;
              }
            }
            else {
              flag = true;
              continue;
            }
          } else {
            flag = true;
            continue;
          }
        }
        if (flag) {
          let y = new Date(this.licenseForm.value.validTo).getFullYear() - new Date(this.licenseForm.value.validFrom).getFullYear();
          let m = new Date(this.licenseForm.value.validTo).getMonth() - new Date(this.licenseForm.value.validFrom).getMonth();
          this.objectArray.push({ ...this.licenseForm.value, month: m + (y * 12) });
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
      } else {
        this.toastService.warning('Invalid License Count!')
      }
    }
  }

  onDelete(i,ele) {
    this.licenseListArray.forEach((e,i) => {
      if(ele.licenseType == e.licenseType){
        this.licenseListArray[i].availableCount = this.licenseListArray[i].availableCount + ele.count;
      }
    });
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

  submitForm(): void {
    if (this.objectArray.length == 0) {
      this.toastService.error('Please add license');
      return;
    }
    if (this.firstForm.valid) {
      this.showLoader = true;
      let data = {
        ...this.firstForm.value,
        "roleId": "627a09affa95cda5c6b83565",
        "role": "Reseller",
        "isActive": true
      }
      data['createdBy'] = this.currentUser.emailId;
      data['fullName'] = data.firstName + ' ' + data.lastName;
      if (this.isEditing) {
        this.resellerService.saveReseller({ ...data, id: this.editId }).subscribe((response) => {

          if (response.status = 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Reseller",
                tenantCode: "EBC",
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.saveLicense(data).subscribe((data) => {
              this.showLoader = false;
              if (response.status = 'Ok') {
                this.router.navigateByUrl('/reseller')
              }
            })
          } else {
            this.showLoader = false;
            response.error.map(obj => {
              if (obj.hasOwnProperty('email')) {
                this.formErrors['email'] = obj['email'];
              } else {
                this.formErrors['apierror'] = `* ${response.error}`;
              }
            });
          }
        }, (error) => {
          this.showLoader = false;
        });
      } else {
        this.resellerService.saveReseller(data).subscribe((response) => {
          if (response.status = 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Reseller",
                tenantCode: "EBC"
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.saveLicense(data).subscribe((data) => {
              if (response.status = 'Ok') {
                this.showLoader = false;
                this.router.navigateByUrl('/reseller')
              }
            })
          } else {
            response.error.map(obj => {
              if (obj.hasOwnProperty('email')) {
                this.formErrors['email'] = obj['email'];
              } else {
                this.formErrors['apierror'] = `* ${response.error}`;
              }
            });
          }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
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

  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.firstForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.firstForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.firstForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = 'Email already existed';
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.firstForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.pattern(emailRegEx)]));
          this.firstForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  validateText(event: any) { keyPressAlpha(event) }

  ngOnDestroy(): void {

  }
}
