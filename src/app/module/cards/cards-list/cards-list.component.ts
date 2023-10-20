import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { permission } from 'src/app/shared/permission';
@AutoUnsubscribe()
@Component({
  selector: 'app-cards-list',
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss']
})
export class CardsListComponent implements OnInit {

  action: any;
  loadingState = false;
  objectArray: Array<any> = [];
  searchText: any = null;
  currentPage: any = 1;
  permissionObject: any = null;
  buListArray: any = [];
  selectedBUCode: any;
  currentUser: any;
  permissionCode = permission;
  templateList: any = [];
  templatesListArray: any;
  dataId: any;
  idFromAdd: any;
  searchFilterBU: any = null;

  constructor(
    public dialog: MatDialog,
    private businessUnitService: BusinessUnitService,
    private dataService: DataService,

  ) {
    this.dataService.currentUser.subscribe((data) => {
      if (data) this.currentUser = data;
    })

    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response
    });

    this.dataService.fetchId().subscribe(data => {
      this.idFromAdd = data
    })
  }

  ngOnInit() {
    if (this.currentUser && this.currentUser.businessUnitIds && this.currentUser.businessUnitIds[0]) {
      this.getSingleObjects();
    } else {
      this.getBUData();
    }

  }
  getSingleObjects() {
    // this.businessUnitService.getBusinessUnitByCode({ code: this.currentUser.businessUnitIds[0] }).subscribe((res) => {
    //   if (res.data) {
    //     this.loadingState = false;
    //     this.buListArray = [res.data];
    //     if (this.buListArray.length > 0)
    //       this.selectedBUCode = this.buListArray[0].code;
    //     this.getObjects();
    //   }
    // }, (error) => {
    //   this.loadingState = false;
    //   this.buListArray = [];
    // })

    let filters = [];
    if (this.currentUser.userType != 'Tenant Admin') {
      if (this.currentUser.hasOwnProperty('businessUnitIds') && this.currentUser.businessUnitIds && this.currentUser.businessUnitIds[0]) {
        this.currentUser.businessUnitIds.map((data) => {
          filters.push({ "propertyName": "Code", "value": data, "caseSensitive": true })
        });
      } else if (this.currentUser.hasOwnProperty('myBuCode')) {
        filters = [{ "propertyName": "Code", "value": this.currentUser.myBuCode, "caseSensitive": true }]
      }
    }
    this.searchFilterBU = { "conditionOperator": 1, "filters": filters }
    this.getBUData();
  }
  getBUData() {
    this.loadingState = true;
    this.businessUnitService.getBusinessUnitList({
      "searchFilter": this.searchFilterBU,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      this.loadingState = false;
      if (res) {
        this.buListArray = res.data;
        this.dataService.selectedBU.subscribe((data: any) => {
          this.selectedBUCode = data
        })
        if (this.buListArray.length > 0 && !this.selectedBUCode)
          if (this.idFromAdd) {
            this.selectedBUCode = this.idFromAdd;
          }
          else {
            this.selectedBUCode = this.buListArray[0].code;
          }
        this.getObjects();
      }
    }, (err) => { this.loadingState = false; });
  }

  getObjects() {
    this.dataService.selectedBU.next(this.selectedBUCode);
    this.buListArray.forEach(data => {
      if (data.code == this.selectedBUCode) {
        this.objectArray = [data];
        this.templateList = [];
        if (this.objectArray[0] && this.objectArray[0].hasOwnProperty('activeTemplateId') && this.objectArray[0]['activeTemplateId']) {
          this.getTemplateList();
        }
      }
    });

    // this.loadingState = true;
    // const params: any = {
    //   "searchFilter": {
    //     "conditionOperator": 0,
    //     "filters": [
    //       {
    //         "propertyName": "Code",
    //         "value": this.selectedBUCode,
    //         "caseSensitive": true
    //       }
    //     ]
    //   },
    //   "page": 1,
    //   "pageSize": 0,
    //   "fields": null
    // };
    // this.dataId = this.selectedBUCode;
    // this.objectArray = [];
    // this.businessUnitService.getBusinessUnitList(params).subscribe((response) => {
    //   this.loadingState = false;
    //   if (response) {
    //     this.objectArray = response.data;
    //     if (this.objectArray[0] && this.objectArray[0].hasOwnProperty('activeTemplateId') && this.objectArray[0]['activeTemplateId']) {
    //       this.getTemplateList();
    //     }
    //   } else {
    //     this.objectArray = [];
    //   }
    // }, (error) => {
    //   this.loadingState = false;
    //   this.objectArray = [];
    // });
  }
  getTemplateList() {
    this.loadingState = true;
    this.businessUnitService.getTemplateList({
      "searchFilter": {
        "conditionOperator": 0,
        "filters": [
          {
            "propertyName": "id",
            "operator": 0,
            "value": this.objectArray[0]['activeTemplateId'],
            "dataType": "string",
            "caseSensitive": true
          }
        ]
      },
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      this.loadingState = false;
      if (res.data && res.data.length > 0 && res.data[0]) {
        this.templatesListArray = res.data;
        this.setFrame();
      } else {
        this.templateList = [];
      }
    }, (err) => { this.loadingState = false; })
  }
  setFrame() {
    this.loadingState = true;
    setTimeout(() => {
      this.templateList = [];
      this.objectArray.map((data, i) => {
        if (data && data.template && data.template.html) {
          let a: any = document.getElementById("mycardFrame" + i)
          // a.innerHTML = data.template.html3;
          a.innerHTML = this.templatesListArray[0]['html']
          this.templateList.push(i + 1);
        }
      })
    }, 500);
    this.loadingState = false;
  }

  onActiveChange(event, item: any) {
    item['isActive'] = (event.target.value == "true" ? true : false);
    item['updatedBy'] = this.currentUser?.emailId;
    this.businessUnitService.saveBusinessUnit(item).subscribe((res) => {
      // this.getObjects();
    })
  }

  ngOnDestroy(): void { }
}
