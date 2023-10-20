import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConnectsService } from 'src/app/service/connects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { VCard } from 'ngx-vcard/ngx-vcard';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-scan-form',
  templateUrl: './scan-form.component.html',
  styleUrls: ['./scan-form.component.scss']
})
export class ScanFormComponent implements OnInit {

  scanForm: FormGroup;
  emailRegEx = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/;
  isEditing: boolean;
  editId: string;
  pageTitle: string;
  isChecked: boolean = false;

  constructor(
    private fb: FormBuilder,
    private connectsService: ConnectsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastService: ToastrService) {
    this.scanForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]+$')])],
      email: [null, [Validators.required, Validators.pattern(this.emailRegEx)]],
      mobileNumber: [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20)])],
      companyName: ["", Validators.compose([Validators.required])],
      designation: ["", Validators.compose([Validators.required])],
      contact1: [null, Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
      contact2: [null, Validators.compose([Validators.minLength(8), Validators.maxLength(20)])],
    });
    this.dataService.formOCR.subscribe((data) => {
      if (data) {
        this.scanForm.patchValue(data);
      }
    })
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update Scan Card' : this.pageTitle = 'Add Scan Card';
    }
  }

  ngOnInit(): void { }

  submitForm() {
    if (this.scanForm.valid) {
      const data = this.scanForm.value
      this.connectsService.saveBusinessCard(data).subscribe((res) => {
        if (res.status !== 'Error') {
          if (this.isChecked) {
            document.getElementById('carddown2').click();
            this.goBack(1000);
          } else {
            this.goBack(0);
          }
        } else {
          this.toastService.error(res.message);
        }
      })
    }
  }

  goBack(time: any) {
    setTimeout(() => {
      this.dataService.formOCRSubject.next({});
      this.router.navigateByUrl('/my-cards');
    }, time);
  }

  is_Checked(event) {
    (event.checked) ? this.isChecked = true : this.isChecked = false
  }

  public generateVCardOnTheFly = (): VCard => {

    // TODO: Generate the VCard before Download
    let telePhone = [];
    if (this.scanForm?.value?.mobileNumber) {
      telePhone.push({
        value: this.scanForm?.value?.mobileNumber,
        param: { type: ['mobile'], value: 'uri' },
      })
    }
    if (this.scanForm?.value?.contact1) {
      telePhone.push({
        value: this.scanForm?.value?.contact1,
        param: { type: ['contact1'], value: 'uri' },
      })
    }
    if (this.scanForm?.value?.contact2) {
      telePhone.push({
        value: this.scanForm?.value?.contact2,
        param: { type: ['contact2'], value: 'uri' },
      })
    }
    return {
      version: '3.0',
      name: {
        firstNames: this.scanForm?.value?.name,
      },
      organization: this.scanForm?.value?.companyName,
      title: this.scanForm?.value?.designation,
      email: [this.scanForm?.value?.email],
      telephone: telePhone,
      // note: `${environment.frontEndURL}end-user?tc=${btoa(this.currentUser.tenantCode)}&em=${btoa(this.scanForm?.value?.email)}`,
      // address: [{ street: address }],
    };
  };

  ngOnDestroy(): void { }

}
