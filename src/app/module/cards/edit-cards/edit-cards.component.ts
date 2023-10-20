import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { DataService } from 'src/app/service/data.service';
import { CommonService } from 'src/app/service/common.service';
import { permission } from 'src/app/shared/permission';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { pdfPatternEx } from 'src/app/shared/common';

@AutoUnsubscribe()
@Component({
  selector: 'app-edit-cards',
  templateUrl: './edit-cards.component.html',
  styleUrls: ['./edit-cards.component.scss']
})
export class EditCardsComponent implements OnInit {
  pageTitle: string = "Add"
  form: FormGroup;
  loadingState = false;
  showLoader = false;
  formErrors = {
    email: null,
    apierror: null,
  };
  isEditing = false;
  editId = null;
  selectedBU: any;
  selectedBUID: any;
  currentUser: any;
  activeForm: number = 2;
  selectedTemplated: any;
  selectedTemplatedIndex: number = 0;
  selectedFile: File;
  backgroundImages: Array<any> = [];
  attributesList: Array<any> = [];
  defaultHTML: any = '';
  permissionObject: any;
  permissionCode = permission;
  templateId: string = '';
  public licenseType: string = '';

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
    })
    this.dataService.permission.subscribe((response) => {
      this.permissionObject = response;
    });

  }
  ngOnInit() {
    this.form = this.fBuilder.group({
      carouselItems: this.fBuilder.array([])
    })
    this.getSingleBUData();
  }

  getSingleBUData() {
    this.businessUnitService.getBusinessUnitById({ id: this.editId }).subscribe((res) => {
      this.selectedBU = res.data;
      this.templateId = this.selectedBU?.activeTemplateId
      this.selectedTemplated = this.selectedBU.template;
      this.selectedBUID = this.editId;
      this.submitFirstForm();
    })

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

  onCheckAttribute(event, i) {
    this.attributesList[i].isEditable = event.checked;
  }

  submitFirstForm() {
    this.activeForm = 2;
    this.attributesList = this.selectedTemplated.attributes;
    this.backgroundImages = [];
    if (this.selectedTemplated.backgroundImages) {
      this.selectedTemplated.backgroundImages.map((data) => { this.backgroundImages.push({ ...data, imagePathName: '' }) })
    }
    if (this.selectedTemplated.carouselItems) {
      this.selectedTemplated.carouselItems.map((data) => {
        this.carouselItemControl.push(
          this.createAndSetCarousalData(data)
        );
      });
    }
    setTimeout(() => {
      let a: any = document.getElementById("selectedmyFrame2")
      a.innerHTML = this.selectedTemplated.html2
      this.setHTMLcarouselItems();
    }, 10);
    // test
    // this.test();
  }

  submitSecondForm() {
    this.activeForm = 3;
    setTimeout(() => {
      let b: any = document.getElementById("selectedmyFrame3")
      b.innerHTML = this.selectedTemplated.html2;
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
    template['html2'] = template.html2;
    template.html = '';
    data = {
      ... this.selectedBU, activeTemplateId: this.templateId,
      template: { ...template, attributes: this.attributesList, backgroundImages: this.backgroundImages, carouselItems: this.carouselItemControl.value },
    }
    if (template)
      if (this.isEditing) {
        this.businessUnitService.saveBusinessUnit(data).subscribe((response) => {
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

  checkStep(step: number = 1) {
    switch (step) {
      case 2:
        this.activeForm = 2;
        setTimeout(() => {
          let a: any = document.getElementById("selectedmyFrame2")
          a.innerHTML = this.selectedTemplated.html2
          this.setHTMLcarouselItems();
        }, 10);
      //   this.submitFirstForm();
        break;
      case 3: {
        if (!this.selectedTemplated || !this.selectedBUID) {
          this.submitFirstForm(); break;
        } else { this.submitSecondForm(); break; }
      }
    }
  }

  createCarousal(type) {
    let fb: any;
    if(type === 'video') {
        fb = new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('{Video}'),
            'description': new FormControl('string'),
            'displayName': new FormControl('Add Youtube link'),
            'defaultValue': new FormControl('', Validators.compose([Validators.required])),
            'imagePathName': new FormControl('')
        })
    } else if(type === 'brochure') {
        fb = new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('{Browchure}'),
            'description': new FormControl('string'),
            'displayName': new FormControl('', Validators.compose([Validators.required])),
            'defaultValue': new FormControl('', Validators.compose([Validators.required, Validators.pattern(pdfPatternEx)])),
            'imagePathName': new FormControl('')
        })
    } else if(type === 'image') {
        fb = new FormGroup({
            'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
            'itemValue': new FormControl('https://ebcblob.blob.core.windows.net/ebc/NEC-Logo.png'),
            'description': new FormControl('string'),
            'displayName': new FormControl('Display Name'),
            'defaultValue': new FormControl(''),
            'imagePathName': new FormControl('')
        })
    }
    this.setHTMLcarouselItems();
    return fb;
  }

  createAndSetCarousalData(data) {

    let fb: any
    if(data.itemValue === '{Video}') {
      fb = new FormGroup({
          'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
          'itemValue': new FormControl('{Video}'),
          'description': new FormControl('string'),
          'displayName': new FormControl('Add Youtube link'),
          'defaultValue': new FormControl(data.defaultValue, Validators.compose([Validators.required])),
          'imagePathName': new FormControl('')
      })
  } else if(data.itemValue === '{Browchure}') {
      fb = new FormGroup({
          'itemName': new FormControl(`{CarouselItem${this.carouselItemControl.length + 1}}`),
          'itemValue': new FormControl('{Browchure}'),
          'description': new FormControl('string'),
          'displayName': new FormControl(data.displayName, Validators.compose([Validators.required])),
          'defaultValue': new FormControl(data.defaultValue, Validators.compose([Validators.required, Validators.pattern(pdfPatternEx)])),
          'imagePathName': new FormControl('')
      })
  } else if(data.itemValue != '{QRCode}' && data.itemValue != '{Vide0}' && data.itemValue != '{Browchure}') {
      fb = new FormGroup({
          'itemName': new FormControl(data.itemName),
          'itemValue': new FormControl(data.itemValue),
          'description': new FormControl('string'),
          'displayName': new FormControl('Display Name'),
          'defaultValue': new FormControl(''),
          'imagePathName': new FormControl(data.itemValue)
      })
  } else if(data.itemValue === '{QRCode}') {
    fb = new FormGroup({
        'itemName': new FormControl(data.itemName),
        'itemValue': new FormControl(data.itemValue),
        'description': new FormControl('string'),
        'displayName': new FormControl(data.displayName),
        'defaultValue': new FormControl(''),
        'imagePathName': new FormControl()
    })
}
  this.setHTMLcarouselItems();
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

  public patchCarousalItem(data) {
    this.carouselItemControl.push(this.createAndSetCarousalData(data));
  }

  onCarouselVideoUpload(data, i) {
    let url = '';
    if(data.includes('youtube.com') || data.includes('youtu.be')) {
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
      this.setHTMLcarouselItems()
    }
    // else {
    //   url = String(data)
    //   this.form.get('carouselItems')['controls'][i].patchValue({
    //     defaultValue: url
    //   })
    // }
    
  }

  ngOnDestroy(): void { }

  setHTMLcarouselItems() {
    let mainData: any = "";
    let temp: any = this.defaultHTML;

    let first = `<div id="carouselExampleIn123" data-bs-interval="false" class="carousel slide slider-main" data-bs-ride="carousel"
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
        style="height: 71px;cursor:pointer;" /></div>`;

      } else {
        carousel_btn_DYNAMIC = carousel_btn_DYNAMIC + `<button type="button" data-bs-target="#carouselExampleIn123" data-bs-slide-to=${i}
        aria-current="true" aria-label="Slide ${i}"
        style="width: 10px;height: 10px;border: 1px solid #000;border-radius: 50%;">
        </button>`;

        if (data.itemValue == '{Video}') {
          carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; ">
          <iframe width="150" height="150" src="${data.defaultValue}" title = "YouTube video player" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen > </iframe></div > `
        } else if (data?.itemValue == '{Browchure}'){
          carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; ">
          <iframe width="150" height="150" src="${data.defaultValue}" title = "Brochure PDF Link" frameborder = "0" allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen > </iframe></div > `
        } else {
          carousel_img_DYNAMIC = carousel_img_DYNAMIC + `<div class="carousel-item " style="text-align: center; "><img
          src="${data.itemValue}" class="img - fluid" alt="..."
          style="height: 71px;cursor:pointer;" /></div>`
        }
      }

    });

    mainData = first + carousel_btn_DYNAMIC + close_div + carousel_inner + carousel_img_DYNAMIC + close_div2 + prev_next_BTN;
    // document.getElementById('carouselExampleIndicators').innerHTML = mainData;
    // let temp2 = temp.replace(`{{test_test_test_test123}}`, mainData);
    // setTimeout(() => {
    //   let a: any = document.getElementById("selectedmyFrame2")
    //   a.innerHTML = temp2;
    // }, 100);
  }

  onPDFClick(pdfURL) {
    window.open(pdfURL, '_blank');
  }
}
