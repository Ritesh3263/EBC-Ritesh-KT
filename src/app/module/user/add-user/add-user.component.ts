import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import { RoleService } from 'src/app/service/role.service';
import { UserService } from 'src/app/service/user.service';
import { validateAllFormFields, linkedInEx, twitterEx, whatsappEx, lineEx, wechatEx, numberEx } from 'src/app/shared/common';
import { SuccessPopupComponent } from 'src/app/core/success-popup/success-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DistributorService } from 'src/app/service/distributor.service';
@AutoUnsubscribe()
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  sataticFillds = []
  loadingState = false;
  addForm: FormGroup;
  addSocialForm: FormGroup
  showLoader = false;
  hide = true;
  formErrors = {
    emailId: null,
    apierror: null,
  };
  attributeArray: FormArray;
  roleListArray: any = [];
  isEditing = false;
  isChangeLicenses: boolean = false;
  editId = null;
  // isPasswordType: string = 'password';
  // isShowPassword: boolean = false;
  pageTitle = 'Add User';
  buListArray: any = [];
  attributeFieldsName: any = [];
  attributeDisplayFieldsName: any = [];
  attributeList: any = [];
  editObject: any;
  currentUser: any;
  notDynamicAttributeArray: any = [];
  selectedProfileFile: any;
  staticField = ['emailid', 'firstname', 'nativename', 'lastname', 'designation', 'primarycontact', 'profilepicture', 'secondarycontact'];
  dynamicToStaticFields: any = [];
  // password: any;
  isMultipleBU: boolean = false;
  input: any;
  emailRegEx = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  searchFilterBU: any = null;
  licenseListArray: any = [];
  currentTenant: any;
  selectedLicense: any = {};
  tempRoleList: any = [];
  roleType;
  roleId;
  licType;
  roleValue: any;
  roleChecked: boolean;
  selectedRole: boolean = false;
  isDownLoad: boolean = false;
  approverList: any = [];
  filteredOptions;
  socialFeilds: any = []
  selectedSocialFeild = '';
  userSocialList: any = [];
  isSocialEdit: boolean = false
  disAddBtn: boolean = false;
  dynamicPlaceholder = 'Enter Social Media URL';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService,
    private businessUnitService: BusinessUnitService,
    private roleService: RoleService,
    private toastService: ToastrService,
    private dataService: DataService,
    private commonService: CommonService,
    public dialog: MatDialog,
    private distributorService: DistributorService
  ) {
    this.addForm = this.fb.group({
      emailId: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],
      firstName: [""],
      lastName: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]+$')])],
      nativeName: [""],
      roleId: [null, Validators.compose([Validators.required])],
      designation: [null, Validators.compose([Validators.required])],
      primaryContact: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      profilePicture: [null],
      // password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      // address: fb.group({
      //   building: [null, Validators.compose([Validators.required])],
      //   street: [null, Validators.compose([Validators.required])],
      //   locality: [null, Validators.compose([Validators.required])],
      //   postalcode: [null, Validators.compose([Validators.required])],
      //   city: [null, Validators.compose([Validators.required])],
      //   state: [null, Validators.compose([Validators.required])],
      //   country: [null, Validators.compose([Validators.required])]
      // }),
      businessUnitIds: [null],
      secondaryContact: [null, Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      attributes: new FormArray([]),
      licenseType: [null],
      linkedId: [null, Validators.compose([Validators.pattern(linkedInEx)])],
      approverId: [null]
    });
    this.addSocialForm = this.fb.group({
      socialFeildName: ['', Validators.required],
      link: ['', Validators.required],
      quant: ['', Validators.required],
    })
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.isChangeLicenses = false;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update User' : this.pageTitle = 'Add User';
      // this.addForm.get('password').clearValidators();
      // this.addForm.get('password').updateValueAndValidity();
    } else { this.isChangeLicenses = true; }

    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.getMasterData();
        if (this.currentUser?.userType != 'Super Admin') {
          this.addForm.get('businessUnitIds').setValidators(Validators.compose([Validators.required]));
          this.addForm.get('businessUnitIds').updateValueAndValidity();
          this.addForm.get('licenseType').setValidators(Validators.compose([Validators.required]));
          this.addForm.get('licenseType').updateValueAndValidity();
          this.dataService.currentTenant.subscribe((data) => {
            if (data) {
              this.currentTenant = data.data;
              this.getLicenseType();
              this.addForm.patchValue({
                primaryContact: this.currentTenant?.primaryContact
              })
            }
          })
        } else {
          this.addForm.get('businessUnitIds').clearValidators();
          this.addForm.get('businessUnitIds').updateValueAndValidity();
          this.addForm.get('licenseType').clearValidators();
          this.addForm.get('licenseType').updateValueAndValidity();
        }
      }
    })

  }

  ngOnInit() {
    if (this.isEditing) {
      this.getEditObject()
      // this.addForm.patchValue({ roleId: "Keshava" })
    }
    this.getUserDropdown()
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

  getLicenseByLicenseeCode() {
    if (this.currentUser?.userType != 'Super Admin') {
      this.distributorService.getLicenseByLicenseeCode(this.editId).subscribe((res) => {
        this.selectedLicense = res.data[0];
        this.addForm.patchValue({
          licenseType: this.selectedLicense?.licenseType
        })
      })
    }
  }

  getMasterData() {
    let filters = [];
    if (this.currentUser.userType != 'Tenant Admin') {
      if (this.currentUser && this.currentUser.businessUnitIds && this.currentUser.businessUnitIds[0]) {
        this.currentUser.businessUnitIds.map((data) => {
          filters.push({ "propertyName": "Code", "value": data, "caseSensitive": true })
        });
      }
    }
    this.searchFilterBU = { "conditionOperator": 1, "filters": filters }

    this.businessUnitService.getBusinessUnitList({
      "searchFilter": this.searchFilterBU,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res) {
        this.loadingState = false;
        this.buListArray = res.data;
        if (this.buListArray.length > 0) {
          // this.addForm.patchValue({ businessUnitIds: this.buListArray[0].code })
          // this.onBUChange();
        }
      }
    });
    if (this.currentUser) {
      let filters = [];
      this.currentUser.roleList.map((type) => { filters.push({ "propertyName": "Name", "value": type, "caseSensitive": true }) })
      this.roleService.getRoleList({ "page": 1, "pageSize": 0, "fields": null, "searchFilter": { "conditionOperator": 1, "filters": filters } }).subscribe((res) => {
        if (res) {
          this.tempRoleList = res.data;
          this.setRoleById();
          if (this.tempRoleList) {
            this.onLicenseChange();
          }
        }
      });
    }
  }

  setRoleById() {
    if (!this.isEditing)
      if (this.editObject && this.editObject.roleId)
        for (let index = 0; index < this.roleListArray.length; index++) {
          const element = this.roleListArray[index];
          if (element.id == this.editObject.roleId) { this.addForm.patchValue({ roleId: element.name }); break; } else continue;
        }
  }

  getEditObject() {
    this.userService.getUserById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.editObject = response.data;
        this.userSocialList = (this.editObject?.sociaMedias ? this.editObject?.sociaMedias : [])
        this.socialFeilds.forEach((value, i) => {
          value.isSelected = false;
          const index = this.userSocialList.findIndex((x) => x?.key === value?.key);
          if (index > -1) {
            this.socialFeilds[i].isSelected = true
          }
        });
        if(this.userSocialList.length == this.socialFeilds.length){
          this.disAddBtn = true;
          this.addSocialForm.get('socialFeildName').clearValidators();
          this.addSocialForm.get('socialFeildName').updateValueAndValidity();
          this.addSocialForm.get('link').clearValidators();
          this.addSocialForm.get('link').updateValueAndValidity();
          this.addSocialForm.get('quant').clearValidators();
          this.addSocialForm.get('quant').updateValueAndValidity();
        }
        if (this.editObject?.role == 'End User') {
          this.selectedRole = true;
        }
        if (this.editObject.isDownload == 'Yes') {
          this.isDownLoad = true;
          this.userService.getApproverList({ BUCode: (this.addForm.value.businessUnitIds) ? this.addForm.value.businessUnitIds : response.data.businessUnitIds[0] }).subscribe((response) => {
            this.approverList = response.data;
            this.filteredOptions = response.data
            this.addForm.get('approverId').valueChanges.subscribe(response => {
              this.filterData(response);
            })
            let index = this.filteredOptions.findIndex((x) => x.id == this.editObject.id); 
            this.filteredOptions.splice(index, 1);
            this.addForm.patchValue({ approverId: this.editObject?.approverId });
          });
          this.addForm.get('approverId').setValidators(Validators.compose([Validators.required]));
          this.addForm.get('approverId').updateValueAndValidity();
        } else {
          this.isDownLoad = false;
          this.addForm.get('approverId').clearValidators();
          this.addForm.get('approverId').updateValueAndValidity();
        }
        if (this.editObject.isMarketingPerson) {
          this.roleChecked = true
        } else {
          this.roleChecked = false;
        }

        this.addForm.patchValue({ ...response.data, password: '' });
        if (response.data.businessUnitIds && response.data.role != 'BU Admin') {
          this.addForm.patchValue({ businessUnitIds: response.data.businessUnitIds[0] });
        } else if (response.data.businessUnitIds && response.data.role == 'BU Admin') {
          this.isMultipleBU = true;
          this.addForm.patchValue({ businessUnitIds: response.data.businessUnitIds });
        }
        this.attributeArray = this.addForm.get('attributes') as FormArray;
        this.attributeArray.clear();
        this.attributeFieldsName = [];
        this.attributeDisplayFieldsName = [];
        this.attributeList = [];
        this.setRoleById();
        this.onLicenseChange();
        this.getLicenseByLicenseeCode();
        if (response.data && response.data.buSpecificAttributes) {
          response.data.buSpecificAttributes.map((data) => {
            if (!this.staticField.includes(String(data.displayName)?.replace(/\s/g, '').toLowerCase())) {
              if (data.isDynamic) {
                this.attributeList.push(data);
                this.attributeDisplayFieldsName.push(data.displayName)
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
      } else {
        this.router.navigateByUrl('/user');
      }
    });

  }

  selectSocialield(item){
    this.selectedSocialFeild=item?.key;
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
      this.addSocialForm.get('link').setValidators([Validators.required]);
      this.addSocialForm.get('link').updateValueAndValidity();
      this.addSocialForm.get('quant').setValidators([Validators.required]);
      this.addSocialForm.get('quant').updateValueAndValidity();
    }
    this.addValidation(item.key);
  }

  async submitForm() { 
    if (this.attributeArray && this.attributeArray.length > 0) {
      this.attributeArray.controls.forEach((control: any, i) => { validateAllFormFields(control) });
    }
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.selectedProfileFile) {
        const data = new FormData(); data.append('file', this.selectedProfileFile);
        await this.commonService.fileUpload(data).then((res: any) => { this.addForm.get('profilePicture').setValue(res.data); })
      }
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
      if (this.addForm.value.businessUnitIds && this.currentUser?.userType != 'Super Admin') {
        let temp = this.isMultipleBU ? this.addForm.value.businessUnitIds : [this.addForm.value.businessUnitIds]
        data = { ...data, businessUnitIds: temp }
      }
      else { data = { ...data, businessUnitIds: [] } }
      delete data.attributes;
      data['fullName'] = data.firstName + ' ' + data.lastName;
      data['createdBy'] = this.currentUser.emailId;
      data['licenseType'] = this.licType;
      data['isMarketingPerson'] = this.roleChecked ? true : false;
      data['isDownload'] = this.isDownLoad ? 'Yes' : 'No';
      if (this.isDownLoad) {
        data['approverId'] = data.approverId
      } else {
        delete data.approverId;
      }
      if (this.isEditing) {
        delete data.password;
        // if (this.addForm.value.password) {
        //   data.password = this.addForm.value.password;
        // } else {
        //   data.password = this.password;
        // }

        this.userService.saveUser({ ...data, id: this.editId, isActive: true }).subscribe((response) => {
          // this.showLoader = false;
          if (response) {
            if(response.status != 'Error') {
              if (this.addForm.value.emailId == this.currentUser.emailId) {
                this.dataService.currentUserSubject.next({ ...this.currentUser, ...response.data })
              }
              if (this.currentUser?.userType == 'Tenant Admin' || this.currentUser?.userType == 'BU Admin') {
                let userType
                this.roleListArray.forEach(e => {
                  if (e.id == this.addForm.controls['roleId'].value)
                    userType = e.name;
                });
                this.distributorService.checkExpiredLicense(this.editId).subscribe((res) => {
                    this.showLoader = false;
                    if(res.message === 'License Expired') {
                      this.selectedLicense.id = null;
                      let oneLicense = {
                        ...this.selectedLicense,
                        licenseType: this.addForm.value.licenseType,
                        createdBy: this.currentUser.emailId,
                        licensorId: this.currentTenant.id,
                        licenseeId: response.data.id,
                        count: 1,
                        validFrom: "2022-05-13T14:08:34.809Z",
                        validTo: "2022-05-13T14:08:34.809Z",
                        userType: userType,
                        tenantCode: this.currentUser.tenantCode,
                      };
                      this.distributorService.saveOneLicense(oneLicense).subscribe((res) => {
                      this.showLoader = false;
                      if (res.status = 'Ok') {
                        this.router.navigateByUrl('/user');
                      }
                    })
                    } else {
                      let oneLicense = {
                        ...this.selectedLicense,
                        licenseType: this.addForm.value.licenseType,
                        createdBy: this.currentUser.emailId,
                        licensorId: this.currentTenant.id,
                        licenseeId: response.data.id,
                        count: 1,
                        validFrom: "2022-05-13T14:08:34.809Z",
                        validTo: "2022-05-13T14:08:34.809Z",
                        userType: userType,
                        tenantCode: this.currentUser.tenantCode,
                      };
                      this.distributorService.saveOneLicense(oneLicense).subscribe((res) => {
                        this.showLoader = false;
                        if (res.status = 'Ok') {
                          this.router.navigateByUrl('/user');
                        }
                      })
                    }
                 })
                
              } else {
                this.router.navigateByUrl('/user');
              }
            } else {
              this.toastService.error(response.message)
            }
          } else {
            this.toastService.error(response.message)
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
      } else {
        this.userService.saveUser({ ...data, isActive: true }).subscribe((response) => {
          this.showLoader = false;
          if (response.status == 'Ok') {
            // this.dialog.open(SuccessPopupComponent, {
            //   data: { defaultValue: response, callback :'addUser' }
            // });
            if (this.currentUser?.userType == 'Tenant Admin' || this.currentUser?.userType == 'BU Admin') {
              let userType
              this.roleListArray.forEach(e => {
                if (e.id == this.addForm.controls['roleId'].value)
                  userType = e.name;
              });
              let oneLicense = {
                licenseType: this.addForm.value.licenseType,
                createdBy: this.currentUser.emailId,
                licensorId: this.currentTenant.id,
                licenseeId: response.data.id,
                count: 1,
                validFrom: "2022-05-13T14:08:34.809Z",
                validTo: "2022-05-13T14:08:34.809Z",
                userType: userType,
                tenantCode: this.currentUser.tenantCode
              };
              this.distributorService.saveOneLicense(oneLicense).subscribe((res) => {
                this.showLoader = false;
                if (res.status = 'Ok') {
                  this.router.navigateByUrl('/user');
                }
              })
            } else {
              this.router.navigateByUrl('/user');
            }

          } else {
            // this.dialog.open(SuccessPopupComponent, {
            //   data: { defaultValue: response, callback :'addUser' }
            // });
            this.toastService.error(response.message)
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
  // showPassword() {
  //   this.isShowPassword = !this.isShowPassword;
  //   this.isShowPassword ? this.isPasswordType = 'text' : this.isPasswordType = 'password';
  // }
  onBUChange() {
    if(this.isDownLoad) {
      this.userService.getApproverList({ BUCode: this.addForm.value.businessUnitIds }).subscribe((response) => {
        this.approverList = response.data;
        this.filteredOptions = response.data;
        this.addForm.get('approverId').valueChanges.subscribe(response => {
          this.filterData(response);
        })
        if(this.editObject) {
          let index = this.approverList.findIndex((x) => x.id == this.editObject.id); 
          this.approverList.splice(index, 1);
        }
      });
    }
    this.buListArray.map((data => {
      if (data.code == this.addForm.value.businessUnitIds) {
        this.attributeArray = this.addForm.get('attributes') as FormArray;
        this.attributeArray.clear();
        this.attributeFieldsName = [];
        this.attributeDisplayFieldsName = [];
        this.attributeList = [];
        data.template.attributes.map((data) => {
          if (!this.staticField.includes(String(data.displayName)?.replace(/\s/g, '').toLowerCase())) {
            if (data.isDynamic) {
              this.attributeList.push(data);
              this.attributeFieldsName.push(data.attributeName);
              this.attributeDisplayFieldsName.push();
              if (String(data.attributeType).toLowerCase() == 'image') {
                this.attributeArray.push(this.fb.group({
                  [data.attributeName]: [''],
                  [`${data.attributeName}_img`]: ['']
                }));
              } else {
                this.attributeArray.push(this.fb.group({ [data.attributeName]: [''] }));
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
      // }
    }))
  }

  singleBUChange() {
    this.buListArray.map((data) => {
      if (data.code == this.addForm.value.businessUnitIds) {

        if (data && data.template && data.template.attributes && data.template.attributes.length == 0) {
          this.addForm.controls['businessUnitIds'].setErrors({ isTemplate: true });
          this.formErrors['businessUnitIds'] = 'Please assign the card template on selected businessUnit';
        } else {
          this.addForm.controls["businessUnitIds"].setValidators([Validators.required]);
          this.formErrors['businessUnitIds'] = false;
          this.onBUChange();
        }
        // this.addForm.get('businessUnitIds').updateValueAndValidity();
      }
    })
  }
  profileChangeEvent(fileInputFile: any) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      this.selectedProfileFile = null;
      return false;
    } else {
      this.selectedProfileFile = null;
      this.selectedProfileFile = fileInputFile.target.files[0];
      this.addForm.get('profilePicture').setValue(this.selectedProfileFile.name);
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
          this.formErrors['emailId'] = 'Email already existed';
        } else {
          // this.addForm.controls['emailId'].setErrors(null);
          this.addForm.get('emailId').setValidators(Validators.compose([Validators.required, Validators.pattern(this.emailRegEx)]));
          this.addForm.get('emailId').updateValueAndValidity();
          this.formErrors['emailId'] = false;
        }
      })
  }

  onRoleChange() {
    this.addForm.patchValue({ businessUnitIds: [] })
    for (let index = 0; index < this.roleListArray.length; index++) {
      const element = this.roleListArray[index];
      if (element.id == this.addForm.value.roleId) {
        if (element.name == 'BU Admin') {
          this.isMultipleBU = true;
          break;
        }
        else this.isMultipleBU = false;
      }
    }
    for (let i = 0; i <= this.roleListArray.length; i++) {
      if (this.roleListArray[i]?.id == this.addForm.get('roleId').value) {
        this.roleValue = this.roleListArray[i].name;

        if (this.roleValue == 'End User' || this.roleValue == 'BU Admin') {
          this.selectedRole = true
        } else {
          this.selectedRole = false
        }
      }
    }
  }

  onLicenseChange() {
    this.roleListArray = [];
    this.licType = this.addForm.value['licenseType']
    this.tempRoleList.map((data) => {
      if (String(data.roleType).toLowerCase().includes(String(this.licType).toLowerCase())) {
        this.roleListArray.push(data);
      }
    })

    let tempRoleName = '';
    for (let index = 0; index < this.tempRoleList.length; index++) {
      const element = this.tempRoleList[index];
      if (element.id == this.addForm.value.roleId) {
        tempRoleName = element.name;
        break;
      }
    }
    if (tempRoleName) {
      this.roleListArray.map((obj) => {
        if (obj.name == tempRoleName) {
          this.addForm.patchValue({ roleId: obj.id })
        }
      })
    }
  }

  is_Checked(event) {
    if (event?.checked) {
      this.roleChecked = true
    } else {
      this.roleChecked = false;
      this.isDownLoad = false;
    }
  }

  isDownLoadChecked(event) {
    if (event?.checked) {
      this.isDownLoad = true
      if(this.addForm.value.businessUnitIds != null) {
        this.userService.getApproverList({ BUCode: this.addForm.value.businessUnitIds }).subscribe((response) => {
          this.approverList = response.data;
          this.filteredOptions = response.data;
          this.addForm.get('approverId').valueChanges.subscribe(response => {
            this.filterData(response);
          })
          if(this.editObject) {
            let index = this.approverList.findIndex((x) => x.id == this.editObject.id); 
            this.approverList.splice(index, 1);
          }
        });
      }
      this.addForm.get('approverId').setValidators(Validators.compose([Validators.required]));
      this.addForm.get('approverId').updateValueAndValidity();
    } else {
      this.isDownLoad = false
      this.addForm.get('approverId').clearValidators();
      this.addForm.get('approverId').updateValueAndValidity();
    }
  }

  filterData(enteredData){
    this.filteredOptions = this.approverList.filter(item => {
      return item?.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getTitle(approveId: string) {
    if(approveId && this.approverList.length > 0){
      return this.approverList.find((option) => option?.id === approveId).name;
    }
  }
  
  ngOnDestroy(): void { }

}
