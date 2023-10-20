import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/service/role.service';
import { ThemePalette } from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

/**
 * @title Basic checkboxes
 */
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})

export class AddRoleComponent implements OnInit {
  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  loadingState = false;
  addForm: FormGroup;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  roleModuleList: any;
  isEditing = false;
  editId = null;
  selected: any;
  pageTitle = 'Add Roles';

  adminType: any = 'Super Admin';
  objectDetails: any;
  flag: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private roleService: RoleService) {

    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.isEditing ? this.pageTitle = 'Update Roles' : this.pageTitle = 'Add Roles';
    }
    this.addForm = this.fb.group({
      name: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([Validators.required])],
    });
  }
  ngOnInit() {

    if (this.isEditing) { this.getEditObject() }
    else { this.getModules(true); }
  }

  onChangeAdminType = (type) => { this.adminType = type; this.getModules(true); }
  getModules(flag) {
    this.flag = flag;
    let data: any =
    {
      "searchFilter": null,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }

    this.flag ? data = {
      ...data,
      "searchFilter": {
        "conditionOperator": 0,
        "filters": [
          {
            "propertyName": "Name",
            "value": this.adminType,
            "caseSensitive": true
          }
        ]
      }
    } : '';

    const param: any = {};
    let isList = true;
    if (!this.flag) {
      isList = false;
      param['id'] = this.objectDetails.accessPermissions[0].moduleId;
    }

    this.roleService.getModules(data, param, isList).subscribe((res) => {
      if (res) {
        if (!this.flag) {
          this.roleModuleList = res.data;
          let tempPermission: any = [];
          this.adminType = this.roleModuleList.name;
          this.roleModuleList.permissions.map((data) => {
            if (this.objectDetails.accessPermissions[0].permissionCodes.includes(data.code)) {
              tempPermission.push({ ...data, isSelect: true })
            } else
              tempPermission.push({ ...data, isSelect: false })
          })
          this.roleModuleList.permissions = tempPermission;
          this.checkSelectAll();
        } else {
          this.roleModuleList = res.data[0];
          let tempPermission: any = [];
          this.roleModuleList.permissions.map((data) => {
            tempPermission.push({ ...data, isSelect: false })
          })
          this.roleModuleList.permissions = tempPermission;
          this.roleModuleList['isSelectAll'] = false;
        }
      }
    });
  }

  onChangePermission(i) {
    this.roleModuleList.permissions[i]['isSelect'] = !this.roleModuleList.permissions[i]['isSelect'];
    this.checkSelectAll();
  }
  checkSelectAll = () => {
    let count = 0;
    this.roleModuleList?.permissions.forEach(element => {
      if (element?.isSelect) count++;
    });
    (this.roleModuleList?.permissions.length == count) ?
      this.roleModuleList['isSelectAll'] = true
      : this.roleModuleList['isSelectAll'] = false;
  }

  selectAll(value) {
    let tempPermission: any = [];
    this.roleModuleList.permissions.map((data) => {
      tempPermission.push({ ...data, isSelect: value?.checked })
    });
    this.roleModuleList.permissions = tempPermission;
    this.roleModuleList['isSelectAll'] = value?.checked;
  }

  getEditObject() {
    this.roleService.getRoleById({ id: this.editId }).subscribe((response) => {
      if (response) {
        this.objectDetails = response.data;
        this.addForm.patchValue(response.data);
        this.getModules(false);
      } else {
        this.router.navigateByUrl('/role');
      }
    });
  }

  submitForm(): void {
    if (this.addForm.valid) {
      this.showLoader = true;
      let permissionCodes = [];
      this.roleModuleList.permissions.map((item) => {
        item.isSelect ? permissionCodes.push(item.code) : '';
      })
      let data =
      {
        ...this.addForm.value,
        "accessPermissions": [
          {
            "moduleId": this.roleModuleList?.id,
            "permissionCodes": permissionCodes
          }
        ]
      }
      if (permissionCodes.length > 0)
        if (this.isEditing) {
          this.roleService.saveRole({ ...data, id: this.editId }).subscribe((response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/role');
            } else {
              response.error.map(obj => {
                if (obj.hasOwnProperty('name')) {
                  this.formErrors['name'] = obj['name'];
                } else {
                  this.formErrors['apierror'] = `* ${response.error}`;
                }
              });
            }
          }, (error) => {
            this.showLoader = false;
          });
        } else {
          this.roleService.saveRole(data).subscribe((response) => {
            this.showLoader = false;
            if (response) {
              this.router.navigateByUrl('/role');
            } else {
              response.error.map(obj => {
                if (obj.hasOwnProperty('name')) {
                  this.formErrors['name'] = obj['name'];
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
