import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { DataService } from 'src/app/service/data.service';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { permission } from 'src/app/shared/permission';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pdfPatternEx } from 'src/app/shared/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-add-cards',
  templateUrl: './add-cards.component.html',
  styleUrls: ['./add-cards.component.scss']
})
export class AddCardsComponent implements OnInit {
  pageTitle: string = "Add"
  form: FormGroup;
  loadingState = false;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null
  };
  buListArray: Array<any> = [];
  templatesListArray: Array<any> = [];
  isEditing = false;
  editId = null;
  selectedBU: any;
  selectedBUID: any;
  currentUser: any;
  activeForm: number = 1;
  selectedTemplated: any;
  selectedTemplatedIndex: any;
  selectedFile: File;
  backgroundImages: Array<any> = [];
  attributesList: Array<any> = [];
  defaultHTML: any = '';
  validYt: any[] = [];
  disBtn = false;
  permissionObject: any;
  permissionCode = permission;
  licenseType = '';
  mainData: any

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastService: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private businessUnitService: BusinessUnitService,
    private fBuilder: FormBuilder
  ) {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.isEditing = true;
      this.editId = this.activatedRoute.snapshot.paramMap.get('id');
      this.pageTitle = "Update";
    }

    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
        this.licenseType = this.currentUser?.licenseType;
      }
    });
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });

  }
  ngOnInit() {
    this.form = this.fBuilder.group({
        carouselItems: this.fBuilder.array([])
    })
    this.getBUData();
  }

  getTemplateList() {
    this.businessUnitService.getTemplateList({
      "searchFilter": null,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res.data && res.data.length > 0 && res.data[0]) {
        this.templatesListArray = res.data;
        this.setFrame();
        this.setActiveTemplate();
      }
    })
  }

  setActiveTemplate() {

    if (this.selectedBU && this.selectedBU.activeTemplateId) {
      this.templatesListArray.map((data, i) => {

        if (this.selectedBU.activeTemplateId == data.id) {

          this.selectedTemplatedIndex = i;
          this.selectedTemplated = this.templatesListArray[i];
        }
      });
    }
  }

  setFrame() {
    setTimeout(() => {
      this.templatesListArray.map((data, i) => {
        let a: any = document.getElementById("myFrame" + i)
        a.innerHTML = data.html
      })
    }, 10);
  }

  getBUData() {
    this.businessUnitService.getBusinessUnitList({
      "searchFilter": null,
      "page": 1,
      "pageSize": 0,
      "fields": null
    }).subscribe((res) => {
      if (res) {
        this.buListArray = res.data;
        this.getTemplateList();
        if (this.activatedRoute.snapshot.queryParams['bu']) {
          this.buListArray.map((data) => {
            if (this.activatedRoute.snapshot.queryParams['bu'] == data.code) this.selectedBU = data;
          })
        } else this.selectedBU = this.buListArray[0];

        (!this.selectedBU) ? this.selectedBU = this.buListArray[0] : '';
        this.selectedBUID = this.selectedBU.id;
        if (this.isEditing) {
          this.getEditObject()
        }
      }
    });
  }

  onBUChange() {
    this.buListArray.map((data) => {
      if (this.selectedBUID == data.id) {
        this.selectedBU = data;
      }
    })
  }

  getEditObject() {
    let param = {
      "searchFilter": {
        "conditionOperator": 0,
        "filters": [
          {
            "propertyName": "id",
            "value": this.editId,
            "caseSensitive": true
          }
        ]
      },
      "page": 1,
      "pageSize": 0,
      "fields": null
    }
  }

  async onBackgroundChange(fileInputFile: any, i) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      return false;
    } else {
      const data = new FormData(); data.append('file', fileInputFile.target.files[0]);
      this.backgroundImages[i] = { ...this.backgroundImages[i], imagePathName: fileInputFile.target.files[0].name };
      await this.commonService.fileUpload(data).then((res: any) => {
        this.backgroundImages[i] = { ...this.backgroundImages[i], imagePath: res.data };
      })
    }
  }

  async onCarouselImageUpload(fileInputFile: any, i) {
    const reg = /(.*?)\.(jpg|jpeg|png|gif|giff)$/;
    if (!fileInputFile.target.files[0].name.match(reg)) {
      this.toastService.error('Please select valid file');
      return false;
    } else {
      const data = new FormData(); data.append('file', fileInputFile.target.files[0]);
      this.form.get('carouselItems')['controls'][i].patchValue({
        imagePathName: fileInputFile.target.files[0].name
      })
      await this.commonService.fileUpload(data).then((res: any) => {
        this.form.get('carouselItems')['controls'][i].patchValue({
            itemValue: res.data
        })
      });
      this.setHTMLcarouselItems()
    }
  }

  onCarouselVideoUpload(data, i) {
    let url = '';
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = data.match(regExp);
    if (match && String(data).includes('youtube.com') && String(data).includes('v=')) {
      url = String(data).split('v=')[1];
      this.form.get('carouselItems')['controls'][i].patchValue({
        defaultValue: `https://www.youtube.com/embed/${url}`
      })
    }
    else if (match && String(data).includes('//youtu.be/')) {
      url = String(data).split('//youtu.be/')[1];
      if(url.includes('&')) {    url = String(url).split('&')[0];  }
      this.form.get('carouselItems')['controls'][i].patchValue({
        defaultValue: `https://www.youtube.com/embed/${url}`
      })
    } else if (match && String(data).includes('youtube.com') && String(data).includes('/embed/')) {
      url = String(data).split('/embed/')[1];
      this.form.get('carouselItems')['controls'][i].patchValue({
        defaultValue: `https://www.youtube.com/embed/${url}`
      })
    }
    // else {
    //   url = String(data)
    //   this.form.get('carouselItems')['controls'][i].patchValue({
    //     defaultValue: url
    //   })
    // }
    this.setHTMLcarouselItems()
  }

  onCheckAttribute(event, i) {
    this.attributesList[i].isEditable = event.checked;
  }

  submitFirstForm() {
    if(this.mainData){
      this.activeForm = 2;
      setTimeout(() => {
        let a: any = document.getElementById("selectedmyFrame2")
          a.innerHTML = this.selectedTemplated.html
          this.setHTMLcarouselItems();
      }, 10);
    }else{
      if (!this.selectedBUID) {
        this.toastService.error('Please select Business Unit')
        return;
      }
      if (!this.selectedTemplated) {
        this.toastService.error('Please select Template')
        return;
      }
      this.activeForm = 2;
      this.attributesList = this.selectedTemplated.attributes;
      this.backgroundImages = [];
      if (this.selectedTemplated.backgroundImages) {
        this.selectedTemplated.backgroundImages.map((data) => { this.backgroundImages.push({ ...data, imagePathName: '' }) })
      }
      if (this.selectedTemplated.carouselItems) {
        this.selectedTemplated.carouselItems.map((data) => {
            this.carouselItemControl.push(this.createCarousalQRCode(data))
        });
      }

      setTimeout(() => {
        let a: any = document.getElementById("selectedmyFrame2")
        a.innerHTML = this.selectedTemplated.html
        this.setHTMLcarouselItems();
      }, 10);
    }
    // test
    // this.test();
  }

  submitSecondForm() {
    this.activeForm = 3;
    setTimeout(() => {
      let b: any = document.getElementById("selectedmyFrame3")
      b.innerHTML = this.selectedTemplated.html;
      this.setHTMLcarouselItems();
    }, 10);
  }

  submitThirdForm() {
    let data: any;
    let template = this.selectedTemplated;
    delete template.createdDate;
    delete template.updatedDate;
    delete template.isSelect;
    delete template.isDeleted;
    delete template.attributes;
    delete template.backgroundImages;
    delete template.carouselItems;
    template['html2'] = template.html;
    template.html = '';
    data = {
      ... this.selectedBU, activeTemplateId: template.id,
      template: { ...template, attributes: this.attributesList, backgroundImages: this.backgroundImages, carouselItems: this.carouselItemControl.value },
    }
    if (template)
      if (this.isEditing) {
        this.businessUnitService.saveBusinessUnit({ id: this.editId, data }).subscribe((response) => {
          this.showLoader = false;
          if (response) {
            this.router.navigateByUrl('/cards');
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
        this.businessUnitService.saveBusinessUnit(data).subscribe((response) => {
          this.showLoader = false;
          // if (response) {

          this.dataService.pushId(this.selectedBU.code);
          this.router.navigateByUrl('/cards');

          // } else {
          //   response.error.map(obj => {
          //     if (obj.hasOwnProperty('email')) {
          //       this.formErrors['email'] = obj['email'];
          //     } else {
          //       this.formErrors['apierror'] = `* ${response.error}`;
          //     }
          //   });
          // }
        }, (error) => {
          this.showLoader = false;
        });
      }
  }

  onSelectTemplate(event, ii) {
    if (event.checked) {
      this.selectedTemplatedIndex = ii;
      this.selectedTemplated = this.templatesListArray[ii];
    } else {
      this.selectedTemplatedIndex = '';
      this.selectedTemplated = '';
    }
  }

  checkStep(step: number = 1) {
    switch (step) {
      case 1:
        this.activeForm = 1;
        this.setFrame();
        break;
      case 2:
        this.submitFirstForm();
        break;
      case 3: {
        if (!this.selectedTemplated || !this.selectedBUID) {
          this.submitFirstForm(); break;
        } else { this.submitSecondForm(); break; }
      }

    }
  }

  createCarousal(type) {
    if(type === 'video') {
        return new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('{Video}'),
            'description': new FormControl('string'),
            'displayName': new FormControl('Add Youtube link'),
            'defaultValue': new FormControl('', Validators.compose([Validators.required])),
            'imagePathName': new FormControl('')
        })
    } else if(type === 'brochure') {
        return new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('{Browchure}'),
            'description': new FormControl('string'),
            'displayName': new FormControl('', Validators.compose([Validators.required])),
            'defaultValue': new FormControl('', Validators.compose([Validators.required, Validators.pattern(pdfPatternEx)])),
            'imagePathName': new FormControl('')
        })
    } else if(type === 'image') {
        return new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('https://ebcblob.blob.core.windows.net/ebc/NEC-Logo.png'),
            'description': new FormControl('string'),
            'displayName': new FormControl('Display Name'),
            'defaultValue': new FormControl(''),
            'imagePathName': new FormControl('')
        })
    }
  }

  createCarousalQRCode(data) {
    let fb = new FormGroup({
        'itemName': new FormControl(data.itemName),
        'itemValue': new FormControl(data.itemValue),
        'description': new FormControl(data.description),
        'displayName': new FormControl(data.displayName),
        'defaultValue': new FormControl(data.defaultValue),
        'imagePathName': new FormControl('')
    })
    return fb;
  }

  get carouselItemControl() {
    return this.form.get("carouselItems") as FormArray;
  }

  removeCarouselItems(i, item) {
    this.carouselItemControl.removeAt(i)
    this.setHTMLcarouselItems();
    }

  public addCarouselItems(type) {
    this.carouselItemControl.push(this.createCarousal(type))
  }

  ngOnDestroy(): void { }

  // test() {
  //   this.selectedTemplated['html'] = `<div class="card-sec" style="height: 700px;background-image: url(https://ebcblob.blob.core.windows.net/ebc/Background_Image.jpg);background-repeat: repeat;background-size: 100% 100%;padding: 20px;box-shadow: rgb(0 0 0 / 40%) 1px 0px 7px 2px;"> <div class="card_firs" style="height: 396px"> <div class="logo-sec d-flex" style="align-items: center;"> <img src="https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png" class="img-fluid width-100" style="width: 80px;cursor: pointer;" data-bs-toggle="modal" data-bs-target="#exampleModal"> <img src="https://ebcblob.blob.core.windows.net/ebc/NEC-Logo.png" class="img-fluid width-100" style="width: 100px;margin-left: 20px;"> </div> <!-- Profile Modal --> <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered"> <div class="modal-content" style="text-align: center; background-color: transparent; border: none;"> <div class="modal-body"> <img src="https://ebcblob.blob.core.windows.net/ebc/DefaultUser.png" class="img-fluid width-100"> </div> </div> </div> </div> <!-- Profile Modal end --> <!-- QR code Modal start --> <div class="modal fade" id="QRcodeModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"> <div class="modal-dialog modal-dialog-centered"> <div class="modal-content" style="text-align: center; background-color: transparent; border: none;"> <div class="modal-body"> <img src="{QRCode}" class="img-fluid width-100"> </div> </div> </div> </div> <!-- QR code Modal end --> <div class="ncc-text text-center" style="margin-bottom: 20px;"> <h2 style="font-size: 20px;color: #3a3a3a;line-height: 22px;margin-top: 12px;color: #3a3a3a;margin-bottom: -12px;font-family: 'Poppins';"> John Doe</h2> <p style="margin-bottom: 0px;margin-top: 0px;"> </p> <p style="color: #000;line-height: 10px;font-size: 13px;margin-top: 15px;"> Software Developer </p> <p style="margin-bottom: 0px;color: #000;line-height: 15px;font-size: 13px;margin-bottom: 0;"> IoT BU </p> <h3 style="font-size: 15px;font-weight: bold;color: #000;font-family: 'Poppins';margin-top: 8px;"> Alphabet Inc. </h3> </div> {{test_test_test_test123}} </div> <div class="list-blue" style="margin-top: 25px;"> <ul style="list-style-type: none;padding: 0;"> <li style="display: flex;align-items: flex-start;margin-bottom: 10px;color: #fff;"><a href="https://maps.google.com/?q=1600 Amphitheatre Parkway Mountain View, CA 94043 USA" target="_blank" style="text-decoration: none;color: #fff;display:flex;word-break: break-word;line-height: 16px;align-items: center;"><img src="https://ebcblob.blob.core.windows.net/ebc/Orange-map.png" style="width: 30px;height: 31px;display: inline-block;margin-right: 8px;margin-top: 5px;border: 1px solid #fff;border-radius: 50%;" /> <span style="padding-top:8px;">1600 Amphitheatre Parkway Mountain View, CA 94043 USA</span></a></li> <li style="display: flex;align-items: flex-start;margin-bottom: 10px;color: #fff;"><a href="mailto:johnDoe@gmail.com" style="text-decoration: none;color: #fff;display: flex;word-break: break-word;line-height: 16px;align-items: center;"><img src="https://ebcblob.blob.core.windows.net/ebc/Orange-mail.png" style="width: 30px;height: 31px;display: inline-block;margin-right: 8px;margin-top: 5px;border: 1px solid #fff;border-radius: 50%;" /> <span style="padding-top:5px;">johnDoe@gmail.com</span></a></li> <li style="display: flex;align-items: flex-start;margin-bottom: 10px;color: #fff;"><a href="tel:111-222-3456" style="text-decoration: none;color: #fff;display:flex;word-break: break-word;line-height: 16px;align-items: center;"><img src="https://ebcblob.blob.core.windows.net/ebc/Orange-mobile.png" style="width: 30px;display: inline-block;margin-right: 8px;margin-top: 5px;border: 1px solid #fff;border-radius: 50%;" /> <span style="padding-top:5px;">111-222-3456</span></a></li> <li style="display: flex;align-items: flex-start:margin-bottom: 10px;color: #fff;"><a href="tel:444-555-7890" style="text-decoration: none;color: #fff;"><img src="https://ebcstorage2022.blob.core.windows.net/ebc/Phone.png" style="width: 30px;display: inline-block;margin-right: 8px;margin-top: 5px;border: 1px solid #fff;border-radius: 50%;"/><span>444-555-7890</span></a></li> </ul> </div> <div class="btn-main" style="margin-top: 20px;display: flex;align-items: center;justify-content: space-between;"> <button class="btn share_button" id="save_contact" style="background: #e6650a;border: 2px solid #fff;color: #fff;border-radius: 6px;" id="share_contact"> <img src="https://ebcblob.blob.core.windows.net/ebc/Save.png" style="width: 20px;" /> Save Contact</button> <button class="btn save_button" id="share_contact" style="background: #e6650a;border: 2px solid #fff;color: #fff;border-radius: 6px;" id="save_contact"><img src="https://ebcblob.blob.core.windows.net/ebc/Share.png" style="width: 20px;" /> Share</button> </div> </div>`;
  //   this.defaultHTML = this.selectedTemplated['html'];

  //   setTimeout(() => {
  //     let a: any = document.getElementById("selectedmyFrame2")
  //     a.innerHTML = this.selectedTemplated.html

  //   }, 10);
  // }

  setHTMLcarouselItems() {
    let temp: any = this.defaultHTML;

    let first = `<div id="carouselExampleIn" data-bs-interval="false" class="carousel slide slider-main" data-bs-ride="carousel"
    style="margin-top: 25px;">
    <div class="carousel-indicators" style="bottom: -45px;">`;
    let carousel_btn_DYNAMIC = ``;
    let close_div = `</div>`;
    let carousel_inner = `<div class="carousel-inner">`;
    let carousel_img_DYNAMIC = ``;
    let close_div2 = `</div>`;
    let prev_next_BTN: any = `<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIn123"
    data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span
     class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIn123"
        data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span
            class="visually-hidden">Next</span>
    </button>
    </div>`;

    // process
    this.carouselItemControl.value.map((data, i) => {
      if (data?.itemValue == '{QRCode}') {
        carousel_btn_DYNAMIC = `<button type="button" data-bs-target="#carouselExampleIn123" data-bs-slide-to="${i}" class="active"
        aria-current="true" aria-label="Slide ${i}" style="width: 10px;height: 10px;border: 1px solid #000;border-radius: 50%;">
        </button>`;
        carousel_img_DYNAMIC = `<div class="carousel-item active" style="text-align: center; "><img
        src="https://ebcblob.blob.core.windows.net/ebc/scan.png " class="img - fluid" alt="..."
        style="height: 105px;cursor:pointer;" /></div>`;
      }
      else if (data?.itemValue == '{Video}'){
        carousel_btn_DYNAMIC = carousel_btn_DYNAMIC + `<button type="button" data-bs-target="#carouselExampleIn123" data-bs-slide-to="${i}" class="active"
        aria-current="true" aria-label="Slide ${i}"
        style="width: 10px;height: 10px;border: 1px solid #000;border-radius: 50%;">
        </button>`;
        carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; ">
        <iframe width="150" height="150" src="${data.defaultValue}" title = "YouTube video player" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen > </iframe></div > `
      } else if (data?.itemValue == '{Browchure}'){
        carousel_btn_DYNAMIC = carousel_btn_DYNAMIC + `<button type="button" data-bs-target="#carouselExampleIn123" data-bs-slide-to="${i}" class="active"
        aria-current="true" aria-label="Slide ${i}"
        style="width: 10px;height: 10px;border: 1px solid #000;border-radius: 50%;">
        </button>`;
        carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; ">
        <iframe width="150" height="150" src="${data.defaultValue}" title = "Brochure PDF Link" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen > </iframe></div > `
      }
      else {
         carousel_btn_DYNAMIC = carousel_btn_DYNAMIC + `<button type="button" data-bs-target="#carouselExampleIn123" data-bs-slide-to="${i}" class="active"
        aria-current="true" aria-label="Slide ${i}"
        style="width: 10px;height: 10px;border: 1px solid #000;border-radius: 50%;">
        </button>`;
        carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; "><img
        src="${data.itemValue}" class="img - fluid" alt="..."
        style="height: 105px;cursor:pointer;" /></div>`
      }
    });
    this.mainData = first + carousel_btn_DYNAMIC + close_div + carousel_inner + carousel_img_DYNAMIC + close_div2 + prev_next_BTN;
    document.getElementById('carouselExampleIndicators').innerHTML = this.mainData;
    // let temp2 = temp.replace(`{{test_test_test_test123}}`, mainData);
    // setTimeout(() => {
    //   let a: any = document.getElementById("selectedmyFrame2")
    //   a.innerHTML = temp2;
    // }, 100);
  }
}
