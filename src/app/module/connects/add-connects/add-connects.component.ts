import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConnectsService } from 'src/app/service/connects.service';

@Component({
  selector: 'app-add-connects',
  templateUrl: './add-connects.component.html',
  styleUrls: ['./add-connects.component.scss']
})
export class AddConnectsComponent implements OnInit {

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  areaListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  selected: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private connectsService: ConnectsService
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
    }

    this.addForm = this.fb.group({
      connects_name: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required])],
      area_id: [null, Validators.compose([Validators.required])],
      connects_bar_code: [null]
    });
  }

  ngOnInit() {
    this.getMasterData()
    if (this.isEditing) {
      this.getEditObject()
    }
  }
  getMasterData() {
    this.connectsService.getMasterData().subscribe((res) => {
      if (res.success) {
        this.areaListArray = res.data.area;
      }
    });
  }

  getEditObject() {
    this.connectsService.getConnectsById(this.editId).subscribe((response) => {
      if (response) {
        this.addForm.patchValue(response.data);
      } else {
        this.router.navigateByUrl('/connects');
      }
    });
  }

  submitForm(formData: any): void {
    if (formData.valid) {
      this.showLoader = true;
      const data = new FormData();
      data.append('connects_name', formData.value.connects_name);
      data.append('email', formData.value.email);
      data.append('area_id', formData.value.area_id);
      data.append('connects_bar_code', formData.value.connects_bar_code);

      if (this.isEditing) {
        this.connectsService.editConnects(this.editId, data).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/connects');
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
      } else {
        this.connectsService.addConnects(data).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/connects');
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
}
