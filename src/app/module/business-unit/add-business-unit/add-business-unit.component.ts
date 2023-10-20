import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AddressService } from 'src/app/service/address.service';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-business-unit',
  templateUrl: './add-business-unit.component.html',
  styleUrls: ['./add-business-unit.component.scss']
})
export class AddBusinessUnitComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  private validateEmail(email){
    var emailRegEx = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return emailRegEx.test(String(email).toLowerCase());
  }
  showLoader = false;
  formErrors = { code: null, addressId: null, apierror: null, };
  isEditing = false;
  editId = null;
  currentUser: any;
  addressListArray: any = [];
  emailArray: any = []
  addOnBlur = true;
  @ViewChild("chipList") chipList;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private dataService: DataService,
    private commonService: CommonService,
    private addressService: AddressService,
    private toastr: ToastrService,
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      code: [null, Validators.compose([Validators.required])],
      addressId: [null, Validators.compose([Validators.required])],
      activeTemplateId: [null],
      csvTemplate: [''],
    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
  }

  ngOnInit() {
    this.getAddressList();
  }

  getAddressList() {
    const params: any = {
      fields: null,
      page: 1,
      pageSize: 0
    };

    this.addressService.getAddressList(params).subscribe((response) => {
      this.loadingState = false;
      if (response.data) {
        this.addressListArray = response.data;
      }
    });

  }
  onAddressChange() {
    if (this.addForm.value['addressId'] && (this.addForm.value['addressId'].length > 2)) {
      this.addForm.controls['addressId'].setErrors({ isMax: true });
      this.formErrors['addressId'] = 'Please Select any two address';
    } else {
      this.addForm.controls["addressId"].setValidators([Validators.required]);
      this.formErrors['addressId'] = false;
    }
    // this.addForm.get('addressId').updateValueAndValidity();
  }

  getEditObject() {
    this.businessUnitService.getBusinessUnitById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data);
        this.is_ShowBuName = response.data.showBuName;
        this.isChecked = (this.is_ShowBuName) ? false : true;
        this.checkBoxLable = (!this.is_ShowBuName)
          ? "BU name hidden on card"
          : "Please check the box to hide BU name on card"
        this.emailArray = response?.data?.enquiryEmail
      } else {
        this.router.navigateByUrl('/business-unit');
      }
    });
  }

  onCheckCodeExist() {
    this.businessUnitService.checkCodeExists(this.addForm.value.code).subscribe((res) => {
      if (res.message == 'Exist') {
        this.addForm.controls['code'].setErrors({ isExit: true });
        this.formErrors['code'] = 'Business unit code already exist';
      } else {
        this.addForm.controls['code'].setErrors(null);
        this.formErrors['code'] = false;
      }
    })
  }

  async submitForm() {
    if (this.addForm.valid) {
      if(this.emailArray?.length > 0){
        this.showLoader = true;
        if (this.isEditing) {
          this.businessUnitService.saveBusinessUnit({ ...this.addForm.value, showBuName: this.is_ShowBuName, id: this.editId, enquiryEmail: this.emailArray }).subscribe((response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/business-unit');
            } else { }
          }, (error) => {
            this.showLoader = false;
          });
        } else {
          let blob = new Blob();
          let file = new File([blob], `${new Date().getTime() * 1000}.csv`, { type: "csv", lastModified: new Date().getTime() })
          const temp = new FormData(); temp.append('file', file);
          await this.commonService.fileUpload(temp).then((res: any) => { this.addForm.get('csvTemplate').setValue(res.data); })
          this.businessUnitService.saveBusinessUnit({ ...this.addForm.value, showBuName: this.is_ShowBuName, enquiryEmail: this.emailArray }).subscribe((response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/business-unit');
            } else { }
          }, (error) => {
            this.showLoader = false;
          });
        }
      }
    }
  }
  checkBoxLable = "Please check the box to hide BU name on card";
  is_ShowBuName = true;
  isChecked = false;

  is_Checked(event) {
    if (event.checked) {
      this.checkBoxLable = "BU name hidden on card";
      this.is_ShowBuName = false;
      this.isChecked = true;
    } else {
      this.checkBoxLable = "Please check the box to hide BU name on card";
      this.is_ShowBuName = true;
      this.isChecked = false;
    }
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our email
    if (value) {
      if(this.validateEmail(value)){
        this.emailArray.push(value);
      }else{
        this.toastr.error('Enter valid email')
      }
      (this.emailArray.length == 0) ? this.chipList.errorState = true : this.chipList.errorState = false;
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email): void {
    const index = this.emailArray.indexOf(email);
    if (index >= 0) {
      this.emailArray.splice(index, 1);
    }
    (this.emailArray.length == 0) ? this.chipList.errorState = true : this.chipList.errorState = false;
  }
  ngOnDestroy(): void { }
}
