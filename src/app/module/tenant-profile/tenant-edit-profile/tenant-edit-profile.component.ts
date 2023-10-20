import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { TenantService } from 'src/app/service/tenant.service';
import { keyPressAddress, keyPressAlpha, PasswordValidation, linkedInEx, youtubeEx, facebookEx } from 'src/app/shared/common';
const pattern = ("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");

@AutoUnsubscribe()
@Component({
  selector: 'app-tenant-edit-profile',
  templateUrl: './tenant-edit-profile.component.html',
  styleUrls: ['./tenant-edit-profile.component.scss']
})
export class TenantEditProfileComponent implements OnInit {

  lowesetlicenseType = 0;
  hide = true;
  hide1 = true;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    primaryEmailId: null,
    code: null,
    apierror: null,
  };
  tierListArray: Array<any> = [];
  isEditing = true;
  selected: any;
  selectedFile: any;
  selectedFileApple: any;
  base64textString: string;
  pageTitle = "Update Tenant";
  tenantDetails: any;
  currentUser: any;
  emailRegEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastrService,
    private tenantService: TenantService,
    private commonService: CommonService,
    private dataService: DataService,
    private location: Location

  ) {

    this.addForm = this.fb.group({
      adminLoginId: [null, Validators.compose([Validators.required, Validators.email,])],
      companyName: [null, Validators.compose([Validators.required])],
      primaryContact: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      primaryEmailId: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],

      secondaryContact: ["", Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      website: ["", Validators.compose([Validators.required, Validators.pattern(pattern)])],
      secondaryEmailId: [null, [Validators.pattern(this.emailRegEx)]],

      // tierId: [null, Validators.compose([Validators.required])],
      logo: [null, Validators.compose([Validators.required])],
      addressId: [""],
      adminPassword: [""],
      isDeleted: [""],
      updatedDate: [""],
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
      // userLicense: [null, Validators.compose([Validators.required])],
      emailTemplate: [''],
      dbConnection: [''],
      code: [null, Validators.compose([Validators.required])],
      new_password: [''],
      confirm_password: [''],
      linkedinId: [null, Validators.compose([Validators.pattern(linkedInEx)])],
      youtubeId: ["", Validators.compose([Validators.pattern(youtubeEx)])],
      facebookId: ["", Validators.compose([Validators.pattern(facebookEx)])],
      appleLogo: [null, Validators.compose([Validators.required])],
    }, {
      validator: PasswordValidation.passwordValidation()
    });

    this.dataService.currentUser.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    })

    this.dataService.currentTenant.subscribe((data) => {
      if (data && data.data) {
        this.tenantDetails = data.data;
        this.addForm.patchValue(data.data);
        this.addForm.patchValue({ address: data.miscData });
        this.addForm.patchValue({
          new_password: data.adminPassword,
          confirm_password: data.adminPassword
        });
        this.onTierChange();
      }
    })
  }

  ngOnInit() {
    // this.getMasterData()
  }

  getMasterData() {
    this.tenantService.getTiers({
      "searchFilter": null,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res) {
        this.tierListArray = res.data;
        this.onTierChange();
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
    }
  }

  fileAppleLogoChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.removeFile();
      return false;
    } else {
      this.removeFile();
      this.selectedFileApple = fileInputFile.target.files[0];
      this.addForm.get('appleLogo').setValue(fileInputFile.target.files[0].name);
    }
  }

  removeFile() {
    this.selectedFile = null;
  }
  // handleReaderLoadedFile(readerEvt) {
  //   var binaryString = readerEvt.target.result;
  //   this.base64textString = 'data:image/png;base64,' + btoa(binaryString);
  // }

  onTierChange() {
    this.tierListArray.map((data) => {
      if (data.id == this.addForm.value.tierId) {
        this.addForm.patchValue({ userLicense: data.licenseCount })
      }
    })
  }

  async submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.selectedFile) {
        const data = new FormData(); data.append('file', this.selectedFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('logo').setValue(res.data); })
      }
      if(this.selectedFileApple) {
        const data1 = new FormData(); data1.append('file', this.selectedFileApple);
        await this.commonService.fileUpload(data1).then((res: any) => { this.addForm.get('appleLogo').setValue(res.data); })
      }
      let data = { ...this.addForm.value, adminPassword: this.addForm.value.new_password, country: this.addForm.value.address.country };
      // delete data.userLicense;
      delete data.new_password; delete data.confirm_password;
      if (this.isEditing) {
        this.tenantService.saveTenant({ ...data, id: this.tenantDetails.id }, this.lowesetlicenseType).subscribe((response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            response.data.tenantCode ? this.getTenantDetails(response.tenantCode) : this.getTenantDetails(this.currentUser?.tenantCode);
            this.toastService.success("Tenant Profile Updated Successfully");
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
      } else { this.showLoader = false; }
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

  getTenantDetails(tenantCode): void {
    this.tenantService.getTenantByCodeEndUser({
      "code": tenantCode
    }).subscribe((res) => {
      if (res && res.data)
        this.dataService.currentTenantSubject.next(res);
    })
  }

  validateText(event: any) { keyPressAlpha(event) }
  validateAddress(event: any) { keyPressAddress(event) }

  ngOnDestroy(): void { }

}
