import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { DistributorService } from 'src/app/service/distributor.service';
import { TenantService } from 'src/app/service/tenant.service';
import { UserService } from 'src/app/service/user.service';
import { keyPressAddress, keyPressAlpha, PasswordValidation, emailRegEx, patternEx, countRegEx, validateAllFormArrayFields, linkedInEx, facebookEx, youtubeEx } from 'src/app/shared/common';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-tenant',
  templateUrl: './add-tenant.component.html',
  styleUrls: ['./add-tenant.component.scss'],
  providers: [ DatePipe ]
})
export class AddTenantComponent implements OnInit {

  lowesetlicenseType;
  hide = true;
  hide1 = true;
  addForm: FormGroup;
  licenseForm: FormGroup;
  showLoader = false;
  formErrors = {
    adminLoginId: null,
    code: null,
    apierror: null,
  };
  tierListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  selected: any;
  selectedFile: any;
  base64textString: string;
  pageTitle = "Add Tenant";
  tenantDetails: any;
  activeForm = 2;
  licenseListArray: any = [];
  selectedLicense: any;
  objectArray: any = [];
  currentUser: any;
  platinum: any = null;
  gold: any = null;
  standard: any = null;
  renewalForm: FormGroup;
  renewalArray: any = [];
  control;
  validTo: any;
  validFrom: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService,
    private tenantService: TenantService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private distributorService: DistributorService,
    public dialog: MatDialog,
    private datepipe: DatePipe

  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update Tenant' : this.pageTitle = 'Add Tenant';
    }

    this.addForm = this.fb.group({
      adminLoginId: [null, Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
      companyName: [null, Validators.compose([Validators.required])],
      primaryContact: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      primaryEmailId: [null, Validators.compose([Validators.required, Validators.pattern(emailRegEx)])],
      secondaryContact: ["", Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      website: ["", Validators.compose([Validators.required, Validators.pattern(patternEx)])],
      secondaryEmailId: ["", Validators.pattern(emailRegEx)],
      logo: [null, Validators.compose([Validators.required])],
      linkedinId: ["", Validators.compose([Validators.pattern(linkedInEx)])],
      youtubeId: ["", Validators.compose([Validators.pattern(youtubeEx)])],
      facebookId: ["", Validators.compose([Validators.pattern(facebookEx)])],
      addressId: [""],
      address: fb.group({
        addressName: [null, Validators.compose([Validators.required])],
        building: [""],
        street: [""],
        locality: [""],
        postalcode: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
        city: [""],
        state: [""],
        country: ["", Validators.compose([Validators.required])],
        isPrimary: [true]
      }),

      emailTemplate: [''],
      dbConnection: [''],
      code: [null, Validators.compose([Validators.required])],
      new_password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      confirm_password: [null, Validators.compose([Validators.required])]
    }, {
      validator: PasswordValidation.passwordValidation()
    });

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
      isChecked: []
    });
    this.renewalForm = this.fb.group({
      renewal: this.fb.array([])
    })

    this.dataService.currentUser.subscribe((response) => {
      if (response) {
        this.currentUser = response;
        if(this.isEditing) {
          this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((response) => {
            if (response) {
              this.objectArray = response.data;
              this.objectArray.forEach(e => {
                e.isChecked = false;
              });
            }
          });
          this.getLicenseType();
        } else {
          this.getLicenseType();
        }
       
      }
    });
  }

  ngOnInit() {
    // this.getMasterData()
    this.activeForm =1;
    if (this.isEditing) {
      this.getEditObject()
    }
  }

  getLicenseType() {
    this.distributorService.GetLicensorBalanceById(this.currentUser.id).subscribe((res) => {
      this.licenseListArray = res.data;
      this.selectedLicense = this.licenseListArray[0];
      this.calculateCount();
    })
  }

  getEditObject() {
    this.tenantService.getTenantById({ id: this.editId }).subscribe((response) => {
      if (response && response.data) {
        this.tenantDetails = response.data;
        this.addForm.patchValue(response.data);
        this.addForm.patchValue({ address: response.miscData });
        this.addForm.patchValue({
          new_password: response.data.adminPassword,
          confirm_password: response.data.adminPassword
        });
      } else {
        this.router.navigateByUrl('/tenant');
      }
    });
    this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((response) => {
      if (response) {
        this.objectArray = response.data;
        this.objectArray.forEach(e => {
          e.isChecked = false;
        });
      }
    });

  }

  fileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedFile = fileInputFile.target.files[0];
      this.addForm.get('logo').setValue(this.selectedFile.name);
      // var reader = new FileReader();
      // reader.onload = this.handleReaderLoadedFile.bind(this);
      // reader.readAsBinaryString(this.selectedFile);
    }
  }

  removeFile() {
    this.selectedFile = null;
  }
  // handleReaderLoadedFile(readerEvt) {
  //   var binaryString = readerEvt.target.result;
  //   this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  // }

  // onTierChange() {
  //   this.tierListArray.map((data) => {
  //     if (data.id == this.licenseForm.value.tierId) {
  //       this.licenseForm.patchValue({ userLicense: data.licenseCount })
  //     }
  //   })
  // }
  submitFirstForm() {
    if (this.addForm.valid) {
      this.activeForm = 2;
    }
  }
  async submitForm() {
    if (this.objectArray.length == 0) {
      this.toastService.error('Please add license');
      return;
    }
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.selectedFile) {
        const data = new FormData(); data.append('file', this.selectedFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('logo').setValue(res.data); })
      }
      let data = { ...this.addForm.value, ...this.licenseForm.value, adminPassword: this.addForm.value.new_password, country: this.addForm.value.address.country };
      delete data.userLicense; delete data.new_password; delete data.confirm_password;
      // dummy license
      // data.tierId = this.tierListArray[0]['id'];
      data['createdBy'] = this.currentUser.emailId;
      if (this.isEditing) {
        this.tenantService.saveTenant({ ...data, id: this.editId }, this.lowesetlicenseType).subscribe((response) => {
          if (response.status == 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Tenant Admin",
                tenantCode: this.addForm.controls['code'].value,
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.renewLicense(data).subscribe((data) => {
              if (response.status = 'Ok') {
                this.showLoader = false;
                this.router.navigateByUrl('/tenant');
              }
            })

          } else {
            this.toastService.error(response.message)
            response.error.map(obj => {
              if (obj.hasOwnProperty('primaryEmailId')) {
                this.formErrors['primaryEmailId'] = obj['primaryEmailId'];
              } else {
                this.formErrors['apierror'] = `* ${response.error}`;
              }
            });
          }
        }, (error) => {
          this.showLoader = false;
        });

      } else {
        delete data.dbConnection;
        this.tenantService.saveTenant(data, this.lowesetlicenseType).subscribe((response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            let data = [];
            this.objectArray.map((item) => {
              let t = {
                ...item,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentUser.id,
                licenseeId: response.data.id,
                userType: "Tenant Admin",
                tenantCode: this.addForm.controls['code'].value
              };
              delete t.month;
              delete t.validTo;
              data.push(t);
            })
            this.distributorService.renewLicense(data).subscribe((data) => {
              if (response.status = 'Ok') {
                this.showLoader = false;
                this.router.navigateByUrl('/tenant');
              }
            })
          } else {
            this.toastService.error(response.message)
            response.error.map(obj => {
              if (obj.hasOwnProperty('primaryEmailId')) {
                this.formErrors['primaryEmailId'] = obj['primaryEmailId'];
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

  onCheckCodeExist() {
    this.tenantService.checkCodeExists(this.addForm.value.code).subscribe((res) => {
      if (res.message == 'Exist') {
        this.addForm.controls['code'].setErrors({ isExit: true });
        this.formErrors['code'] = 'Tenant code already exit';
      } else {
        this.addForm.controls['code'].setErrors(null);
        this.formErrors['code'] = false;
      }
    })
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }
  isAutofocus = false;

  onLicenseChange() {
    this.isAutofocus=true;
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
        for (let index = 0; index < this.objectArray.length; index++) {
          const item = this.objectArray[index];
          if ((String(item.licenseType).toLowerCase()) === (String(this.licenseForm.value.licenseType).toLowerCase())) {
            tempCount = tempCount + item.count
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
          if (this.objectArray.length == 0) {
            let year = new Date(this.licenseForm.value.validTo).getFullYear() - new Date().getFullYear();
            let month = new Date(this.licenseForm.value.validTo).getMonth() - new Date().getMonth();
            this.objectArray.push({ ...this.licenseForm.value, month: month + (year * 12) });
          } else {
            let year = new Date(this.objectArray[0].validTo).getFullYear() - new Date().getFullYear();
            let month = new Date(this.objectArray[0].validTo).getMonth() - new Date().getMonth();
            this.objectArray.push({ ...this.licenseForm.value, month: month + (year * 12), validTo: this.objectArray[0].validTo });
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
          var min = Math.min(...this.objectArray.map(e => e.temp))
          if (min == 0) this.lowesetlicenseType = "Standard";
          if (min == 1) this.lowesetlicenseType = "Gold";
          if (min == 2) this.lowesetlicenseType = "Platinum";

        }

      } else {
        this.toastService.warning('Invalid License Count!')
      }
    }
    // this.calculateCount();
  }

  UpdateLicenses() {
    validateAllFormArrayFields(this.renewalForm.controls['renewal']);
    if (this.renewalForm.valid) {
      this.distributorService.renewLicense(this.renewalForm.value.renewal).subscribe(data => {
        if (data) {
          this.toastService.success(data.message);
          this.getEditObject();
          this.ClosePopup();
        }
        this.dialog.closeAll();
      }, (err => {
        this.toastService.error(err.error.message)
      }));
    }

  }

  onDelete(i, ele) {
    this.licenseListArray.forEach((e, i) => {
      if (ele.licenseType == e.licenseType) {
        this.licenseListArray[i].availableCount = this.licenseListArray[i].availableCount + ele.count;
      }
    });

    this.objectArray.splice(i, 1);
    this.objectArray.forEach(e => {
      if (e.licenseType == "Gold") e.temp = 1
      if (e.licenseType == "Platinum") e.temp = 2;
      if (e.licenseType == "Standard") e.temp = 0;
    });
    var min = Math.min(...this.objectArray.map(e => e.temp))
    if (min == 0) this.lowesetlicenseType = "Standard";
    if (min == 1) this.lowesetlicenseType = "Gold";
    if (min == 2) this.lowesetlicenseType = "Platinum";
  }

  onRenew(data: any = null) {

    this.control = <FormArray>this.renewalForm.get('renewal');
    let temp1: any = [];
    temp1 = this.objectArray;
    let isCheckedTrueItems: any = [];
    let tempisCheckedTrueItems: any = [];
    // let tempdummyArray:any=[];

    temp1.map(ewe => {
      if (ewe.isChecked) {
        isCheckedTrueItems.push(ewe)
        tempisCheckedTrueItems.push(ewe)
        // tempdummyArray.push(ewe)
      }
    });

    let tempdummyArray = isCheckedTrueItems;
    for (let i = 0; i < isCheckedTrueItems.length; i++) {
      for (let j = i + 1; j < isCheckedTrueItems.length; j++) {
        if (isCheckedTrueItems[i].licenseType === isCheckedTrueItems[j].licenseType) {
          tempdummyArray[i].count = tempisCheckedTrueItems[i].count + tempisCheckedTrueItems[j].count;
        }
      }
    }

    for (let i = 0; i < tempdummyArray.length; i++) {
      for (let j = i + 1; j < tempdummyArray.length; j++) {
        if (tempdummyArray[i].licenseType == tempdummyArray[j].licenseType) {
          if (tempdummyArray[i].count > tempdummyArray[j].count) {
            tempdummyArray.splice(j, 1);
          }
        }
      }
    }

    tempdummyArray.forEach(obj => {
      const validTo = new Date(obj.validTo); validTo.setFullYear(validTo.getFullYear() + 1);
      this.control.push(this.fb.group({
        count: [obj.count, Validators.compose([Validators.required, Validators.min(1), Validators.pattern(countRegEx)])],
        licenseType: [obj.licenseType, Validators.compose([Validators.required])],
        validTo: [validTo],
        // month: [12],
        userType: ['Tenant Admin'],
        createdBy: [this.currentUser.emailId],
        licensorId: [this.currentUser.id],
        licenseeId: [this.editId],
        validFrom: [obj.validFrom],
      }));
    });

    this.dialog.open(data, {
      width: '683px',
      height: '504px',
      data: { ...data, isRenew: true },
      panelClass: 'delete-popup',
      disableClose: true
    });

     this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((response) => {
      if (response) {
        this.objectArray = response.data;
        for (let i = 0; i < tempisCheckedTrueItems.length; i++) {
          if(tempisCheckedTrueItems[i].isChecked){
            for (let j = 0; j < this.objectArray.length; j++) {
              if(tempisCheckedTrueItems[i].id == this.objectArray[j].id){
                this.objectArray[j].isChecked = true;
              }
            }
          }
        }
      }
    });
  }

  ClosePopup() {
    this.control = (<FormArray>this.renewalForm.get('renewal')).clear();
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
    this.formErrors['adminLoginId'] = false;
    if (this.addForm.controls['adminLoginId'].valid)
      this.userService.checkLoginIdExists({ adminLoginId: this.addForm.value.adminLoginId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.addForm.controls['adminLoginId'].setErrors({ isExit: true });
          this.formErrors['adminLoginId'] = 'Email already existed';
        } else {
          // this.addForm.controls['adminLoginId'].setErrors(null);
          this.addForm.get('adminLoginId').setValidators(Validators.compose([Validators.required, Validators.pattern(emailRegEx)]));
          this.addForm.get('adminLoginId').updateValueAndValidity();
          this.formErrors['adminLoginId'] = false;
        }
      })
  }

  onCheckboxChange(element, i) {
    this.objectArray[i]['isChecked'] = !this.objectArray[i]['isChecked'];
  }

  ConvertIndStd(da: any) {
    let yy = da.substr(0, 4);
    let mm = da.substr(5, 2);
    let dd = da.substr(8, 2);
    return new Date(yy, mm - 1, dd);
  }

}
