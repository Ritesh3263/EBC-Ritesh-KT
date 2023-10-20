import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { DataService } from 'src/app/service/data.service';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { UserService } from 'src/app/service/user.service';
import { environment } from 'src/environments/environment';
import { VCard } from 'ngx-vcard';
import { permission } from 'src/app/shared/permission';
import { WebcamImage } from 'ngx-webcam';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@AutoUnsubscribe()
@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {

  action: any;
  loadingState = false;
  objectArray: any = null;
  permissionObject: any = null;
  currentUser: any;
  activeUser: any;
  buListArray: any;
  isCameraShow: boolean = false;
  currentTenant: any;
  permissionCode = permission;
  currentTenantAddress: any;
  noCardFound: boolean = false;
  public webcamImage: WebcamImage = null;
  isImageConfirm: boolean = false;
  docFile: File;
  cardLink: any;
  appleWalletURL: any = '';
  // isNavaigate:boolean = false;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private businessUnitService: BusinessUnitService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.activeUser = this.currentUser;
        this.getBUData();
        // this.getBase64FromUrl(this.activeUser.profilePicture);
      }
    })
    this.dataService.currentTenant.subscribe((data) => {
      if (data) {
        this.currentTenant = data.data;
        this.currentTenantAddress = data.miscData;
      }
    })
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response
    });
  }

  ngOnInit() {
    // this.getUserObject();
    // this.getBUData();
  }
  handleImage(webcamImage: WebcamImage) {
    if (webcamImage) {
      this.webcamImage = webcamImage;
      this.isImageConfirm = !this.isImageConfirm;
    }
  }
  handleClose() {
    this.loadingState = true;
    this.isCameraShow = false;
    setTimeout(() => {
      let a: any = document.getElementById("mYYcardFrame");
      a.innerHTML = this.objectArray.data;
      this.loadingState = false;
    }, 500);
  }

  // getUserObject() {
  //   this.userService.getUserById({ id: this.currentUser.id }).subscribe((response) => {
  //     if (response && response.data) {
  //       this.activeUser = response.data;
  //       this.getBUData();
  //     }
  //   });
  // }

  // getBase64FromUrl = async (url) => {
  //   const data = await fetch(url);
  //   const blob = await data.blob();
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = () => {
  //       const base64data: any = reader.result;
  //       this.base64Image = base64data.split(';base64,')[1];
  //       resolve(base64data);
  //     }
  //   });
  // }

  getBUData() {
    let filters = [];
    if (this.activeUser.hasOwnProperty('businessUnitIds') && this.activeUser.userType == 'End User') {
      this.activeUser.businessUnitIds.map((code) => {
        filters.push({
          "propertyName": "Code",
          "value": code,
          "caseSensitive": true
        });
      })
    } else if (this.activeUser.hasOwnProperty('myBuCode') && (this.activeUser.userType == 'Tenant Admin' || this.activeUser.userType == 'BU Admin')) {
      filters = [({
        "propertyName": "Code",
        "value": this.activeUser['myBuCode'],
        "caseSensitive": true
      })];
    }
    const params: any = {
      "searchFilter": { "conditionOperator": 0, "filters": filters },
      "page": 1,
      "pageSize": 0,
      "fields": null
    };
    this.loadingState = true;
    this.businessUnitService.getBusinessUnitList(params).subscribe((res) => {
      this.loadingState = false;
      if (res) {
        this.buListArray = res.data;
        if (this.buListArray[0] && this.buListArray[0].hasOwnProperty('activeTemplateId') && this.buListArray[0]['activeTemplateId']) {
          this.getObjects();
        } else {
          this.noCardFound = true;
        }
      }
    }, (err) => { this.loadingState = false; });
  }

  getObjects() {
    this.loadingState = true;
    this.businessUnitService.previewTemplateList({
      // templateId: this.buListArray[0].activeTemplateId,
      buId: this.buListArray[0].code,
      userEmailId: this.activeUser.emailId
    }).subscribe((response) => {
      this.loadingState = false;

      // if(!response.enquiryForm){
      //   this.isNavaigate = true;
      // }

      if (response.status == "Ok") {
        this.objectArray = response;
        this.setFrame();
        this.noCardFound = false;
      }
      else {
        this.objectArray = null;
        this.noCardFound = true;
      }
    }, (error) => {
      this.loadingState = false;
      this.objectArray = null;
      this.noCardFound = true;
    });
  }

  setFrame() {
    setTimeout(() => {
      // this.objectArray.map((data, i) => {
      let a: any = document.getElementById("mYYcardFrame");
      a.innerHTML = this.objectArray.data
      // })
    }, 1000);
    this.loadingState = false;
  }

  onActiveChange(event, item: any) {
    item['isActive'] = (event.target.value == "true" ? true : false);
    item['updatedBy'] = this.currentUser?.emailId;
    this.businessUnitService.saveBusinessUnit(item).subscribe((res) => {
      // this.getObjects();
    })
  }

  async shareDialog() {
    // const dialogRef = this.dialog.open(SharePopupComponent, {
    //   width: '630px',
    //   height: '670px',
    //   data: {},
    //   panelClass: 'share-popup'
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // });
    const blob = await (await fetch(this.objectArray.message)).blob();
    const file = new File([blob], 'my_qr.png', { type: blob.type });
    navigator.share({
      title: `${this.activeUser.firstName} ${this.activeUser.lastName}`,
      text: `${this.currentTenant.companyName}\n${this.activeUser.firstName} ${this.activeUser.lastName}\nScan this QR or Open the given below link.`,
      files: [file],
      url: `${environment.frontEndURL}end-user?tc=${btoa(this.currentUser.tenantCode)}&em=${btoa(this.currentUser.emailId)}`
    })
  }

  ngOnDestroy(): void { }

  /** TO Check the Tag name and check the ID of element than click  */
  @HostListener('document:click', ['$event'])
  clickout(event) {
    let temp: any = event.target.outerHTML;

    // for BUTTON TAG
    temp = (String(temp));
    if (temp[0] == '<' && temp[1] == 'b' && temp[2] == 'u' && temp[3] == 't' && temp[4] == 't' && temp[5] == 'o' && temp[6] == 'n') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown2').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }
    // for DIV TAG
    else if (temp[0] == '<' && temp[1] == 'd' && temp[2] == 'i' && temp[3] == 'v') {
      if (temp.includes('title="YouTube video player"')) {
        let iframe = document.getElementsByTagName('iframe')[0].src += "?autoplay=0";
      }
    }

    // for IMG TAG
    else if (temp[0] == '<' && temp[1] == 'i' && temp[2] == 'm' && temp[3] == 'g') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown2').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }

    // for SPAN TAG
    else if (temp[0] == '<' && temp[1] == 's' && temp[2] == 'p' && temp[3] == 'a' && temp[4] == 'n') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown2').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }

  }

  public generateVCardOnTheFly = (): VCard => {

    let address: string = `${this.currentTenantAddress?.building} ${this.currentTenantAddress?.street} ${this.currentTenantAddress?.locality} ${this.currentTenantAddress?.city} ${this.currentTenantAddress?.state} ${this.currentTenantAddress?.country}-${this.currentTenantAddress?.postalcode}`

    // TODO: Generate the VCard before Download
    if (this.activeUser) {
      let telePhone = [];
      if (this.activeUser.primaryContact) {
        telePhone.push({
          value: this.activeUser.primaryContact,
          param: { type: ['home'], value: 'uri' },
        })
      }
      if (this.activeUser.secondaryContact) {
        telePhone.push({
          value: this.activeUser.secondaryContact,
          param: { type: ['work'], value: 'uri' },
        })
      }
      return {
        version: '3.0',
        name: {
          firstNames: this.activeUser.firstName, lastNames: this.activeUser.lastName,
          // namePrefix: 'Mr.'
        },
        organization: this.currentTenant.companyName,
        title: this.activeUser.designation,
        email: [this.activeUser.emailId],
        telephone: telePhone,
        note: `${environment.frontEndURL}end-user?tc=${btoa(this.currentUser.tenantCode)}&em=${btoa(this.currentUser.emailId)}`,
        url: `${this.currentTenant?.website} `,
        address: [{ street: address }],
        // rev: '20080424T195243Z',
        // photo: `ENCODING = b; TYPE = JPEG:${ this.base64Image } `,
      };
    }
    else {
      return {
        name: {
          firstNames: 'NEC',
          lastNames: 'NEC',
        },
      }
    }
  };

  onPreview() {
    // if(this.isNavaigate){
    let url = `${environment.frontEndURL}end-user?tc=${btoa(this.currentUser.tenantCode)}&em=${btoa(this.currentUser.emailId)}`;
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
    // }
  }

  submitConfirmImage() {
    const arr = this.webcamImage.imageAsDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.docFile = new File([u8arr], 'doc.png', { type: this.webcamImage['_mimeType'] })
    const formData = new FormData();
    const param: any = {};
    formData.append('file', this.docFile);
    this.businessUnitService.docReaderOCR(formData, param).subscribe((res) => {
      this.dataService.formOCRSubject.next(res.data);
    });
  }

  addToWallet() {
    this.businessUnitService.getAppleWalletPassLink({
      buId: this.buListArray[0].code,
      emailId: this.activeUser.emailId
    }).subscribe((response) => {
      this.appleWalletURL = response.data;
      setTimeout(() => {
        document.getElementById('apple_pass').click()
      }, 500);
    }, err => {

    })
  };

  uploafFromGallery(e) {
    const formData = new FormData();
    const param: any = {};
    formData.append('file', e.target.files[0]);
    this.businessUnitService.docReaderOCR(formData, param).subscribe((res) => {
      if (res?.status == 'ok') {
        this.dataService.formOCRSubject.next(res.data);
        //  if(Object.keys(res.data).length >=5 ) {
        this.router.navigate(['/my-cards/scan-card']);
        //  }
      } else {
        this.toastr.error(res.message)
      }
    }, (err) => {
      this.toastr.error('Invalid Data')
    });
  }
}
