import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AddressService } from 'src/app/service/address.service';
import { DataService } from 'src/app/service/data.service';
import { TenantService } from 'src/app/service/tenant.service';
import { keyPressAddress, keyPressAlpha } from 'src/app/shared/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.scss']
})
export class AddressAddComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;

  currentUser: any;
  currentTenant: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private addressService: AddressService,
    private dataService: DataService,
    private tenantService: TenantService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.isEditing) { this.getEditObject(); }
    }

    this.addForm = this.fb.group({
      addressName: [null, Validators.compose([Validators.required])],
      building: [""],
      street: [""],
      locality: [""],
      postalcode: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      city: [""],
      state: [""],
      country: ["", Validators.compose([Validators.required])],
      isPrimary: [false]
    });

    this.dataService.currentUser.subscribe((user) => { if (user) this.currentUser = user; });
    this.dataService.currentTenant.subscribe((tenant) => { if (tenant) this.currentTenant = tenant; });
  }

  ngOnInit() { }

  getEditObject() {
    this.addressService.getAddressById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data)
      } else {
        this.router.navigateByUrl('/address');
      }
    });
  }

  submitForm() {
    if (this.addForm.valid) {
      this.showLoader = true;
      if (this.isEditing) {
        this.addressService.saveAddress({ ...this.addForm.value, id: this.editId }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/address');
            if (response.data.isPrimary) {
              this.getTenantDetails(this.currentTenant.data.code);
            }
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      } else {

        this.addressService.saveAddress({ ...this.addForm.value }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/address');
          } else { }
        }, (error) => {
          this.showLoader = false;
        });
      }
    }
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
