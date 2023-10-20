import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { ChangePasswordComponentPopup } from 'src/app/core/change-password-popup/change-password-popup.component';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { DistributorService } from 'src/app/service/distributor.service';
import { RoleService } from 'src/app/service/role.service';
import { TenantService } from 'src/app/service/tenant.service';
import { UserService } from 'src/app/service/user.service';
import { enableAllFormFields, validateAllFormFields, linkedInEx, facebookEx, youtubeEx, twitterEx, whatsappEx, lineEx, wechatEx, numberEx } from 'src/app/shared/common';
import { MatDialog } from '@angular/material/dialog';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']

})
export class EditProfileComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  addSocialForm: FormGroup;
  showLoader = false;
  formErrors = {
    emailId: null,
    apierror: null,
  };
  attributeArray: FormArray;
  roleListArray: any = [];
  isEditing = false;
  editId = null;
  pageTitle = 'Update Profile';
  buListArray: any = [];
  attributeFieldsName: any = [];
  attributeDisplayFieldsName: any = [];
  attributeList: any = [];
  editObject: any;
  currentUser: any;
  notDynamicAttributeArray: any = [];
  selectedProfileFile: any;
  staticField = ['emailid', 'firstname', 'nativename', 'lastname', 'designation', 'primarycontact', 'profilepicture', 'secondarycontact', 'twitter', 'linkedin', 'line', 'whatsapp', 'wechat'];
  dynamicToStaticFields: any = [];
  isProfileEditable: boolean = false;
  isMultipleBU: boolean = false;
  searchFilterBU: any = null;
  licenseListArray: any = [];
  selectedLicense: any;
  currentTenant: any;
  isLoader = false;
  socialFeilds: any = [];
  selectedSocialFeild = '';
  isSocialEdit: boolean = false;
  userSocialList: any = [];
  disAddBtn: boolean = false;
  dynamicPlaceholder = 'Enter Social Media URL';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private businessUnitService: BusinessUnitService,
    private roleService: RoleService,
    private toastService: ToastrService,
    private dataService: DataService,
    private commonService: CommonService,
    private location: Location,
    private distributorService: DistributorService,
    public dialog: MatDialog,
  ) {
    this.addForm = this.fb.group({
      emailId: [{ value: null, disabled: true }, Validators.compose([Validators.email])],
      firstName: [{ value: "", disabled: true }],
      lastName: [{ value: null, disabled: true }, Validators.compose([Validators.required])],
      nativeName: [{ value: "", disabled: true }],
      roleId: [null],
      password: [""],
      designation: [{ value: null, disabled: true }],
      primaryContact: [{ value: null, disabled: true }, Validators.compose([Validators.required,Validators.minLength(8), Validators.maxLength(20)])],
      profilePicture: [{ value: null, disabled: true }],
      linkedId: [null, Validators.compose([Validators.pattern(linkedInEx)])],
      // address: fb.group({
      //   building: [null, Validators.compose([Validators.required])],
      //   street: [null, Validators.compose([Validators.required])],
      //   locality: [null, Validators.compose([Validators.required])],
      //   postalcode: [null, Validators.compose([Validators.required])],
      //   city: [null, Validators.compose([Validators.required])],
      //   state: [null, Validators.compose([Validators.required])],
      //   country: [null, Validators.compose([Validators.required])]
      // }),
      businessUnitIds: [],
      secondaryContact: [{ value: null, disabled: true }, Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      attributes: new FormArray([]),
      myBuCode: [''],
      licenseType: [null]
    });

    this.addSocialForm = this.fb.group({
      socialFeildName: ['', Validators.required],
      link: ['', Validators.required],
      quant: ['', Validators.required],
    })

    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.isEditing = true;
        this.editId = this.currentUser.id;
        this.getMasterData();
        if (this.currentUser?.userType != 'Super Admin') {
          this.addForm.get('licenseType').setValidators(Validators.compose([Validators.required]));
          this.addForm.get('licenseType').updateValueAndValidity();
          this.dataService.currentTenant.subscribe((data) => {
            if (data) {
              this.currentTenant = data.data;
              this.getLicenseType();
            }
          })
        } else if (this.currentUser?.userType === 'BU Admin') {
          this.addForm.get('myBuCode').setValidators(Validators.compose([Validators.required]));
          this.addForm.get('myBuCode').updateValueAndValidity();
        } else {
          this.addForm.get('myBuCode').clearValidators();
          this.addForm.get('myBuCode').updateValueAndValidity();
          this.addForm.get('licenseType').clearValidators();
          this.addForm.get('licenseType').updateValueAndValidity();
          this.addForm.get('linkedId').clearValidators();
          this.addForm.get('linkedId').updateValueAndValidity();
        }
        if (this.currentUser?.userType === 'Tenant Admin') {
          this.addForm.get('linkedId').setValidators(Validators.compose([Validators.pattern(linkedInEx)]));
          this.addForm.get('linkedId').updateValueAndValidity();
        } else {
          this.addForm.get('linkedId').clearValidators();
          this.addForm.get('linkedId').updateValueAndValidity();
        }
      }
    })
  }

  ngOnInit() {
    this.getUserDropdown();
   }

  getLicenseType() {
    this.distributorService.GetLicensorBalanceById(this.currentTenant.id).subscribe((res) => {
      this.licenseListArray = res.data;
    })
  }

  getUserDropdown(){
    this.userService.getUserData().subscribe((response) => {
      this.socialFeilds = response?.data;
      this.socialFeilds.forEach((item, i) => {
        this.socialFeilds[i].isSelected = false
      })
    })
  }

  getMasterData() {
    let filters = [];
    if (this.currentUser.userType != 'Tenant Admin') {
      if (this.currentUser.hasOwnProperty('businessUnitIds') && this.currentUser.businessUnitIds && this.currentUser.businessUnitIds[0]) {
        this.currentUser.businessUnitIds.map((data) => {
          filters.push({ "propertyName": "Code", "value": data, "caseSensitive": true })
        });
      } else if (this.currentUser.hasOwnProperty('myBuCode') && this.currentUser.myBuCode) {
        filters = [{ "propertyName": "Code", "value": this.currentUser.myBuCode, "caseSensitive": true }]
      }
    }
    this.searchFilterBU = { "conditionOperator": 1, "filters": filters }

    let param = {
      "searchFilter": this.searchFilterBU,
      "page": 1,
      "pageSize": 0,
      "fields": null
    };
    this.showLoader = true;
    this.businessUnitService.getBusinessUnitList(param).subscribe((res) => {
      this.showLoader = false;
      if (res) {
        this.buListArray = res.data;
        this.getEditObject();

      }
    });

    if (this.currentUser) {
      let filters = [];
      this.currentUser.roleList.map((type) => { filters.push({ "propertyName": "RoleType", "value": type, "caseSensitive": true }) })
      this.roleService.getRoleList({ "page": 1, "pageSize": 0, "fields": null, "searchFilter": { "conditionOperator": 1, "filters": filters } }).subscribe((res) => {
        if (res) { this.roleListArray = res.data; this.setRoleById(); }
      });
    }
  }
  setRoleById() {
    if (this.editObject && this.editObject.roleId)
      for (let index = 0; index < this.roleListArray.length; index++) {
        const element = this.roleListArray[index];
        if (element.id == this.editObject.roleId) { this.addForm.patchValue({ roleId: element.name }); break; } else continue;
      }
  }

  checkIsEditable() {
    if (this.currentUser.userType == "End User") {
      this.staticField.map((field) => {
        if (this.dynamicToStaticFields && this.dynamicToStaticFields.length > 0) {
          this.dynamicToStaticFields.forEach(element => {
            if (field == (String(element.displayName)?.replace(/\s/g, '').toLowerCase())) {
              if (element.isEditable) {
                switch (field) {
                  case 'firstname': this.addForm.get('firstName').enable(); break;
                  case 'lastname': this.addForm.get('lastName').enable(); break;
                  case 'nativename': this.addForm.get('nativeName').enable(); break;
                  case 'emailid': this.addForm.get('emailId').enable(); break;
                  case 'designation': this.addForm.get('designation').enable(); break;
                  case 'primarycontact': this.addForm.get('primaryContact').enable(); break;
                  case 'secondarycontact': this.addForm.get('secondaryContact').enable(); break;
                  case 'profilepicture': this.addForm.get('profilePicture').enable(); this.isProfileEditable = true; break;
                }
              }
            }
          });
        }
      });

      this.socialFeilds.forEach((el, k) => {
        let index = this.dynamicToStaticFields.findIndex(x => x.displayName.replace(/\s/g, '').toLowerCase() == el.key.toLowerCase());
        if( index > -1) {
          if(this.dynamicToStaticFields[index].isEditable == false) {
            this.socialFeilds[k].isSelected = true
          }
        }
      })
    } else {
      this.addForm.get('firstName').enable();
      this.addForm.get('lastName').enable();
      this.addForm.get('nativeName').enable();
      this.addForm.get('emailId').enable();
      this.addForm.get('designation').enable();
      this.addForm.get('primaryContact').enable();
      this.addForm.get('secondaryContact').enable();
      this.addForm.get('profilePicture').enable();
      this.isProfileEditable = true;
    }
  }

  getEditObject() {
    this.showLoader = true;
    this.userService.getUserById({ id: this.editId }).subscribe((response) => {
      this.showLoader = false;
      if (response && response.data) {
        this.editObject = response.data;
        this.userSocialList = (this.editObject?.sociaMedias ? this.editObject?.sociaMedias : [])
        if(this.userSocialList?.length > 0){
          this.socialFeilds.forEach((value, i) => {
            value.isSelected = false;
            const index = this.userSocialList.findIndex((x) => x?.key === value?.key);
            if (index > -1) {
              this.socialFeilds[i].isSelected = true
            }
          });
        }
        if(this.userSocialList.length == this.socialFeilds.length){
          this.disAddBtn = true;
          this.addSocialForm.get('socialFeildName').clearValidators();
          this.addSocialForm.get('socialFeildName').updateValueAndValidity();
          this.addSocialForm.get('link').clearValidators();
          this.addSocialForm.get('link').updateValueAndValidity();
          this.addSocialForm.get('quant').clearValidators();
          this.addSocialForm.get('quant').updateValueAndValidity();
        }
        this.addForm.patchValue({ ...response.data });
        if (response.data.businessUnitIds && response.data.role != 'BU Admin') {
          if (response.data.hasOwnProperty('businessUnitIds') && response.data.businessUnitIds[0]) {
            this.addForm.patchValue({ businessUnitIds: response.data.businessUnitIds[0] });
          } else {
            // this.addForm.patchValue({ businessUnitIds: [] });
          }
        } else if (response.data.businessUnitIds && response.data.role == 'BU Admin') {
          this.isMultipleBU = true;
          this.addForm.patchValue({ businessUnitIds: response.data.businessUnitIds });
        }
        // response.data.businessUnitIds ? this.addForm.patchValue({ businessUnitIds: response.data.businessUnitIds[0] }) : '';
        this.attributeArray = this.addForm.get('attributes') as FormArray;
        this.attributeArray.clear();
        this.attributeFieldsName = [];
        this.attributeList = [];
        this.setRoleById();

        if ((response.data && response.data.buSpecificAttributes && this.buListArray.length > 0 && response.data.buSpecificAttributes.length > 0)) {
          this.buListArray[0].template.attributes.map((data) => {
            if (!this.staticField.includes(String(data.displayName)?.replace(/\s/g, '').toLowerCase())) {
              if (data.isDynamic) {
                this.attributeList.push(data);
                this.attributeFieldsName.push(data.attributeName);
                if (String(data.attributeType).toLowerCase() == 'image') {
                  this.attributeArray.push(this.fb.group({
                    [data.attributeName]: [data.value],
                    [`${data.attributeName}_img`]: [data.value]
                  }));
                } else {
                  this.attributeArray.push(this.fb.group({ [data.attributeName]: [data.value] }));
                }

              } else {
                this.notDynamicAttributeArray.push(data);
              }
            } else { 
              if (data.isDynamic) { this.dynamicToStaticFields.push(data); } else {
                this.notDynamicAttributeArray.push(data);
              }
            }
          })
        }
        this.checkIsEditable();
      } else {
        this.router.navigateByUrl('/my-cards');
      }
    });
    // this.GetLicensorBalanceById();
  }

  selectSocialield(item){
    this.selectedSocialFeild=item?.key
    this.addValidation(item?.key);
  }

  addValidation(key) {
    if(key == 'LinkedIn') {
      this.dynamicPlaceholder = 'Ex : https://www.linkedIn.com';
      this.addSocialForm.get('link').setValidators([Validators.required, Validators.pattern(linkedInEx)]);
      this.addSocialForm.get('link').updateValueAndValidity();
    } else if(key == 'Twitter') {
      this.dynamicPlaceholder = 'Ex : https://www.twitter.com';
      this.addSocialForm.get('link').setValidators([Validators.required, Validators.pattern(twitterEx)]);
      this.addSocialForm.get('link').updateValueAndValidity();
    } else if(key == 'Whatsapp') {
      this.dynamicPlaceholder = 'Ex:+9189289182';
      this.addSocialForm.get('link').setValidators([Validators.required, Validators.pattern(numberEx)]);
      this.addSocialForm.get('link').updateValueAndValidity();
    } else if(key == 'Line') {
      this.dynamicPlaceholder = 'Ex : https://www.line.me';
      this.addSocialForm.get('link').setValidators([Validators.required, Validators.pattern(lineEx)]);
      this.addSocialForm.get('link').updateValueAndValidity();
    } else if(key == 'WeChat') {
      this.dynamicPlaceholder = 'Id: johnnie';
      this.addSocialForm.get('link').setValidators([Validators.required]);
      this.addSocialForm.get('link').updateValueAndValidity();
    }
  }

  addItem(formDirective: FormGroupDirective){
    if(this.addSocialForm.valid){
      this.socialFeilds.forEach((company, i)=> {
        if(company?.key ==  this.selectedSocialFeild){
          this.socialFeilds[i].isSelected = true
        }
      });
      if(this.isSocialEdit){
        this.isSocialEdit = false
      }
      this.userSocialList.push({
        key:this.addSocialForm.value.socialFeildName,
        link:this.addSocialForm.value.link,
        displayName:this.addSocialForm.value.quant,
      })
      formDirective.resetForm();
      this.addSocialForm.reset();
      this.selectedSocialFeild = ''
      if(this.userSocialList.length == this.socialFeilds.length){
        this.disAddBtn = true;
        this.addSocialForm.get('socialFeildName').clearValidators();
        this.addSocialForm.get('socialFeildName').updateValueAndValidity();
        this.addSocialForm.get('link').clearValidators();
        this.addSocialForm.get('link').updateValueAndValidity();
        this.addSocialForm.get('quant').clearValidators();
        this.addSocialForm.get('quant').updateValueAndValidity();
      }
    }
  }

  delUserSocialList(item, i){
    this.userSocialList.forEach(social => {
      if(social?.key == item.key){
        this.userSocialList.splice(i, 1)
      }
    })

    this.socialFeilds.forEach((feild, i) => {
      if(feild?.key == item.key){
        this.socialFeilds[i].isSelected = false
      }
    })

    if(this.userSocialList.length != this.socialFeilds.length){
      this.disAddBtn = false;
      this.addSocialForm.get('socialFeildName').setValidators([Validators.required]);
      this.addSocialForm.get('socialFeildName').updateValueAndValidity();
      this.addSocialForm.get('link').setValidators([Validators.required]);
      this.addSocialForm.get('link').updateValueAndValidity();
      this.addSocialForm.get('quant').setValidators([Validators.required]);
      this.addSocialForm.get('quant').updateValueAndValidity();
    }
    this.addSocialForm.reset();
  }

  editUserSocialList(item, i){
    this.isSocialEdit = true
    this.userSocialList.forEach(social => {
      if(social?.key == item.key){
        this.selectedSocialFeild = this.userSocialList[i].key
        this.addSocialForm.patchValue({ socialFeildName: this.userSocialList[i].key})
        this.addSocialForm.patchValue({ link: this.userSocialList[i].link})
        this.addSocialForm.patchValue({ quant: this.userSocialList[i].displayName})
        this.userSocialList.splice(i, 1);
      }
    })
    this.socialFeilds.forEach((feild, i) => {
      if(feild?.key == item?.key){
        this.socialFeilds[i].isSelected = false
      }
    })
    if(this.userSocialList.length != this.socialFeilds.length){
      this.disAddBtn = false;
      this.addSocialForm.get('socialFeildName').setValidators([Validators.required]);
      this.addSocialForm.get('socialFeildName').updateValueAndValidity();
      this.addValidation(item?.key);
      this.addSocialForm.get('quant').setValidators([Validators.required]);
      this.addSocialForm.get('quant').updateValueAndValidity();
    }
  }

  async submitForm() {
    if (this.addForm.valid) {
      if (this.attributeArray && this.attributeArray.length > 0) {
        this.attributeArray.controls.forEach((control: any, i) => { validateAllFormFields(control) });
      }
      enableAllFormFields(this.addForm)
      this.showLoader = true;
      // if (this.selectedProfileFile) {
      //   const data = new FormData(); data.append('file', this.selectedProfileFile);
      //   await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      // }
      let BuAttributes: any = [];
      if (this.attributeArray && this.attributeArray.length > 0) {
        this.attributeArray.controls.forEach((control: any, i) => { validateAllFormFields(control) });
        this.addForm.value.attributes.map((data, i) => {
          Object.keys(data).forEach((key) => {
            if (!key.includes('_img'))
              BuAttributes.push({ ...this.attributeList[i], "attributeName": key, "value": data[key], });
          });
        })
      }
      this.dynamicToStaticFields.map((data) => {
        switch (String(data.displayName)?.replace(/\s/g, '').toLowerCase()) {
          case 'firstname': BuAttributes.push({ ...data, value: this.addForm.value.firstName }); break;
          case 'emailid': BuAttributes.push({ ...data, value: this.addForm.value.emailId }); break;
          case 'lastname': BuAttributes.push({ ...data, value: this.addForm.value.lastName }); break;
          case 'nativename': BuAttributes.push({ ...data, value: this.addForm.value.nativeName }); break;
          case 'designation': BuAttributes.push({ ...data, value: this.addForm.value.designation }); break;
          case 'primarycontact': BuAttributes.push({ ...data, value: this.addForm.value.primaryContact }); break;
          case 'secondarycontact': BuAttributes.push({ ...data, value: this.addForm.value.secondaryContact }); break;
          case 'profilepicture': BuAttributes.push({ ...data, value: this.addForm.value.profilePicture }); break;
        }
      })

      BuAttributes = [...BuAttributes, ...this.notDynamicAttributeArray];
      let data = { ...this.addForm.value, buSpecificAttributes: BuAttributes, sociaMedias: this.userSocialList };
      // if (this.currentUser.userType == 'BU Admin' || this.currentUser.userType == 'End User') {
      //   if (this.addForm.value.businessUnitIds) { data = { ...data, businessUnitIds: [this.addForm.value.businessUnitIds] } }
      //   else { data = { ...data, businessUnitIds: [] } }
      // }
      if (this.addForm.value.businessUnitIds && this.currentUser?.userType != 'Super Admin') {
        let temp = this.isMultipleBU ? this.addForm.value.businessUnitIds :
          (this.addForm.value.businessUnitIds.length > 0) ? [this.addForm.value.businessUnitIds] : [];
        data = { ...data, businessUnitIds: temp }
      }
      else { data = { ...data, businessUnitIds: [] } }

      delete data.attributes;
      data['fullName'] = data.firstName + ' ' + data.lastName;
      if (this.isEditing) {
        this.userService.saveUser({ ...data, id: this.editId, isActive: true }).subscribe((response) => {
          if (response.status == 'Ok') {
            // this.dataService.updateAuth({ ...this.currentUser, ...response.data });
            this.refreshPage();
            let oneLicense = {
              ...this.selectedLicense,
              licenseType: this.addForm.value.licenseType,
              createdBy: this.currentUser.emailId,
              licensorId: this.currentTenant.id,
              licenseeId: response.data.id,
              count: 1,
              validFrom: "2022-05-13T14:08:34.809Z",
              validTo: "2022-05-13T14:08:34.809Z",
            };
            if (this.currentUser.userType == 'Tenant Admin') {
              this.distributorService.saveOneLicense(oneLicense).subscribe((res) => {
                this.showLoader = false;
                if (res.status = 'Ok') {
                  // this.location.back();
                }
              })
            } else {
              this.refreshPage();
            }
            // if (this.currentUser.userType == 'End User') {
            //   this.router.navigateByUrl('/my-cards');
            // } else {
            //   this.location.back();
            // }
          } else {
            this.toastService.error(response.message);
            response.error.map(obj => {
              if (obj.hasOwnProperty('emailId')) {
                this.formErrors['emailId'] = obj['emailId'];
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

  refreshPage() {
    this.isLoader = true;
    this.commonService.GetCurrentUserProfile().subscribe((response) => {
      this.isLoader = false;
      if (response) {
        this.dataService.refreshAuth(response);
        this.toastService.success("Profile Updated Successfully");
      }
    }, (err) => {
      this.dataService.purgeAuth();
      window.location.reload();
    });
  }

  async profileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.selectedProfileFile = null;
      return false;
    } else {
      this.selectedProfileFile = null;
      this.selectedProfileFile = fileInputFile.target.files[0];
      if (this.selectedProfileFile) {
        const data = new FormData(); data.append('file', this.selectedProfileFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      }
      // this.addForm.get('profilePicture').setValue(this.selectedProfileFile.name);
    }
  }
  // Image fields in attributes Array
  SelectedFile: any;
  selectedIndex: number = 0;
  async fileChangeEvent(fileInputFile: any, i) {
    this.selectedIndex = i;
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.RemoveFile();
      return false;
    } else {
      this.RemoveFile();
      this.SelectedFile = fileInputFile.target.files[0];
      this.addForm.controls['attributes']['controls'][i].patchValue({ [`${this.attributeFieldsName[i]}_img`]: this.SelectedFile.name })
      const data = new FormData(); data.append('file', this.SelectedFile);
      await this.commonService.fileUpload(data).then((res: any) => {
        this.addForm.controls['attributes']['controls'][this.selectedIndex].patchValue({ [`${this.attributeFieldsName[this.selectedIndex]}`]: res.data })
      })
      // var reader = new FileReader();
      // reader.onload = this.HandleReaderLoadedFile.bind(this);
      // reader.readAsBinaryString(this.SelectedFile);
    }
  }
  RemoveFile() {
    this.SelectedFile = null;
  }
  verifyEmail() {
    this.formErrors['emailId'] = false;
    if (this.addForm.controls['emailId'].valid)
      this.userService.checkLoginIdExists({ emailId: this.addForm.value.emailId }).subscribe((res) => {
        if (res.message == 'Exist') {
          this.addForm.controls['emailId'].setErrors({ isExit: true });
          this.formErrors['emailId'] = 'Email already exit';
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.addForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.email]));
          this.addForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  // GetLicensorBalanceById() {
  //   if (this.currentUser?.userType != 'Super Admin') {
  //     this.distributorService.GetLicensorBalanceById(this.editId).subscribe((res) => {
  //       this.selectedLicense = res.data[0];
  //       this.licenseListArray = res.data;
  //       this.addForm.patchValue({
  //         licenseType: this.selectedLicense?.licenseType
  //       })
  //     })
  //   }
  // }

  singleBUChange() {
    this.buListArray.map((data) => {
      if (data.code == this.addForm.value.myBuCode) {
        if (!data.activeTemplateId) {
          this.addForm.controls['myBuCode'].setErrors({ isTemplate: true });
          this.formErrors['myBuCode'] = 'Please assign the card template on selected businessUnit';
        } else {
          this.formErrors['myBuCode'] = false;
        }
      }
    })
  }

  socialMediaEditCheck(item) {
    let index = this.dynamicToStaticFields.findIndex(x => x.displayName.replace(/\s/g, '').toLowerCase() == item.displayName.toLowerCase());
    if(index >= 0) {
      if(this.dynamicToStaticFields[index].isEditable) {
        return false;
      } else {
        return true;
      }
    }

  }

  ngOnDestroy(): void { }
}
