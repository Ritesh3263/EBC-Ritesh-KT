import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/service/data.service';
import { DistributorService } from 'src/app/service/distributor.service';
import { countRegEx, emailRegEx, keyPressAlpha } from 'src/app/shared/common';
import { UserService } from 'src/app/service/user.service';
import { CommonService } from 'src/app/service/common.service';
import { ArrayDataSource } from '@angular/cdk/collections';
let COUNT = {
  availableCount: 0,
  totalCount: 0,
  utilizedCount: 0
};

@AutoUnsubscribe()
@Component({
  selector: 'app-add-distributor',
  templateUrl: './add-distributor.component.html',
  styleUrls: ['./add-distributor.component.scss']
})
export class AddDistributorComponent implements OnInit {
  displayedColumns: string[] = ['license', 'count', 'startDate', 'validTo', 'month'];
  objectArray: Array<any> = [];
  loadingState = false;
  firstForm: FormGroup;
  licenseForm: FormGroup;
  activeForm = 1;
  showLoader = false;
  formErrors = { email: null, apierror: null, emailId: null };
  licenseListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  pageTitle = "Add Distributor";
  selectedLicense: any = {};
  currentUser: any;
  platinum: any = COUNT;
  gold: any = COUNT;
  standard: any = COUNT;
  licensorBalanceByIdArray: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private distributorService: DistributorService,
    private toastService: ToastrService,
    private dataService: DataService,
    private userService: UserService,
    private commonService: CommonService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update Distributor' : this.pageTitle = 'Add Distributor';
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
    this.dataService.currentUser.subscribe((response) => {
      this.currentUser = response;
    });
  }

  ngOnInit() {
    this.licenseListArray = [
      { name: 'Standard', value: '10' },
      { name: 'Gold', value: '7' },
      { name: 'Platinum', value: '8' }
    ]
    this.selectedLicense = this.licenseListArray[0];
    if (this.isEditing) {
      this.getEditObject()
    }
  }

  onLicenseChange() {
    // this.licenseForm.value;
    this.licenseForm.patchValue({ count: 0 });
    this.licenseListArray.map((data) => {
      if (this.licenseForm.value['licenseType'] == data.name) {
        this.selectedLicense = data;
        this.licenseForm.patchValue({ count: 0 })
        // this.licenseForm.controls["count"].setValidators([Validators.required, Validators.min(0), Validators.max(this.selectedLicense.value)]);
        // this.licenseForm.get('count').updateValueAndValidity();
      }
    })
  }

  getEditObject() {
    this.distributorService.getDistributorById(this.editId).subscribe((response) => {
      if (response) {
        this.firstForm.patchValue(response.data);
      } else {
        this.router.navigateByUrl('/distributor');
      }
    });
    this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((response) => {
      if (response) {
        this.objectArray = response.data;
      }
    });
    this.distributorService.GetLicensorBalanceById(this.editId).subscribe((response) => {
      if (response) {
        this.licensorBalanceByIdArray = response.data;
        this.calculateCount();
      }
    });
  }

  fromChange() {
    if (this.firstForm.valid) {
      this.activeForm = 2;
    }
  }

  addLicense() {
    if (this.licenseForm.valid) {
      let flag = true;

      for (let index = 0; index < this.objectArray.length; index++) {
        const item = this.objectArray[index];
        if ((String(item.licenseType).toLowerCase()) === (String(this.licenseForm.value.licenseType).toLowerCase())) {
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
    }
  }
  // this.calculateCount();


  onDelete(i) {
    this.objectArray.splice(i, 1);
  }

  countUpdate(type) {
    let count = this.licenseForm.value.count;
    if (type == '+') {
      count++;
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
        "roleId": "627a0928fa95cda5c6b83562",
        "role": "Distributor",
        "isActive": true
      }
      data['createdBy'] = this.currentUser.emailId;
      data['fullName'] = data.firstName + ' ' + data.lastName;
      if (this.isEditing) {
        this.distributorService.saveDistributor({ ...data, id: this.editId }).subscribe((response) => {
          if (response.status = 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Distributor",
                tenantCode: "EBC"
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.saveLicense(data).subscribe((data) => {
              this.showLoader = false;
              if (response.status = 'Ok') {
                this.router.navigateByUrl('/distributor')
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
        this.distributorService.saveDistributor(data).subscribe((response) => {
          if (response.status = 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Distributor",
                tenantCode: "EBC"
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.saveLicense(data).subscribe((data) => {
              if (response.status = 'Ok') {
                this.showLoader = false;
                this.router.navigateByUrl('/distributor')
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
    this.licensorBalanceByIdArray.map((data) => {
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
  validateText(event: any) { keyPressAlpha(event) }

  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.firstForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.firstForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.firstForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = 'Email already existed';
        } else {
          // this.firstForm.controls['emailId'].setErrors(null);
          this.firstForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.pattern(emailRegEx)]));
          this.firstForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }


  sortData(name) {
    // Frontend Short
    this.commonService.isShort = !this.commonService.isShort
    this.objectArray = this.commonService.sortData(name, this.objectArray);
  }

  ngOnDestroy(): void {

  }
}
