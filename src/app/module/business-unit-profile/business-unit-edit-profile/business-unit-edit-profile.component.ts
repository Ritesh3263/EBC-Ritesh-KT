import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { ToastrService } from 'ngx-toastr';
import { AddressService } from 'src/app/service/address.service';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { CommonService } from 'src/app/service/common.service';
import { DataService } from 'src/app/service/data.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-business-unit-edit-profile',
  templateUrl: './business-unit-edit-profile.component.html',
  styleUrls: ['./business-unit-edit-profile.component.scss']
})
export class BusinessUnitEditProfileComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = { code: null, addressId: null, apierror: null, };
  isEditing = true;
  currentUser: any;
  addressListArray: any = [];
  buListArray: any = [];
  selectedBUID: any = "";
  selectedBU: any;

  constructor(
    private location: Location,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private businessUnitService: BusinessUnitService,
    private dataService: DataService,
    private commonService: CommonService,
    private addressService: AddressService
  ) {
    this.addForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      code: [null, Validators.compose([Validators.required])],
      addressId: [null, Validators.compose([Validators.required])],
      csvTemplate: [''],
      activeTemplateId: [null],
    });

    this.dataService.currentUser.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.getBUData();
      }

    });
  }

  ngOnInit() {
    this.getAddressList();
  }

  getBUData() {
    let filters = [];
    this.currentUser.businessUnitIds.map((data) => {
      filters.push({ "propertyName": "Code", "value": data, "caseSensitive": true })
    });
    let searchFilterBU = { "conditionOperator": 1, "filters": filters }
    this.businessUnitService.getBusinessUnitList({
      "searchFilter": searchFilterBU,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {

      if (res) {
        this.buListArray = res.data;
        if (this.buListArray.length > 0) {
          this.selectedBUID = this.buListArray[0].id;
          this.selectedBU = this.buListArray[0];
          this.onBUChange();

        }
      }
    });
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
    this.addForm.get('addressId').updateValueAndValidity();
  }

  onCheckCodeExist() {
    this.businessUnitService.checkCodeExists(this.addForm.value.code).subscribe((res) => {
      if (res.message == 'Exist') {
        this.addForm.controls['code'].setErrors({ isExit: true });
        this.formErrors['code'] = 'Business unit code already exit';
      } else {
        this.addForm.controls['code'].setErrors(null);
        this.formErrors['code'] = false;
      }
    })
  }

  async submitForm() {
    if (!this.selectedBUID) {
      this.toastrService.error('Please select Business unit');
      return;
    }
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.isEditing) {
        this.businessUnitService.saveBusinessUnit({ ...this.addForm.value, id: this.selectedBU.id }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.location.back();
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {
        this.showLoader = false;
      }
    }
  }
  onBUChange() {
    this.buListArray.map((data) => {
      if (this.selectedBUID == data.id) {
        this.selectedBU = data;
        this.addForm.patchValue(this.selectedBU);
      }
    })
  }
  ngOnDestroy(): void { }
}
