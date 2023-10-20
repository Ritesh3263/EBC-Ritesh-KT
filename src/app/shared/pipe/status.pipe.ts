import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/service/data.service';

@Pipe({
  name: 'cardSizeSortForm'
})
export class CardSizeSortForm implements PipeTransform {
  public transform(value: any, args?: any): any {
    let text = null;
    if (value) {
      switch (value.value) {
        case 'pixels':
          text = `px`;
          break;
        case 'inches':
          text = `in`;
          break;
        case 'centimeters':
          text = `cm`;
          break;
        default:
          text = 'px';
          break;
      }
      return text;
    }
  }
}
@Pipe({
  name: 'cardSizeFullForm'
})
export class CardSizeFullForm implements PipeTransform {
  public transform(value: any, args?: any): any {
    let text = null;
    if (value) {
      switch (value.value) {
        case 'px':
          text = `pixels`;
          break;
        case 'in':
          text = `inches`;
          break;
        case 'cm':
          text = `centimeters`;
          break;
        default:
          text = 'pixels';
          break;
      }
      return text;
    }
  }
}

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value ? parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '00';
    // return parseFloat(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

@Pipe({
  name: 'userLicense'
})
export class userLicensePipe implements PipeTransform {

  tierList: any = []
  constructor(public dataService: DataService) {
    this.dataService.tierListArray.subscribe(data => {
      this.tierList = data;
    })
  }
  transform(value: any, args?: any): any {
    let text = "";
    if (value) {
      this.tierList.map((tire) => {
        if (tire?.id && value && tire?.id == value) {
          text = tire?.licenseCount;
        }
      })

      return text;
    }
  }
}

@Pipe({
  name: 'tireName'
})
export class TireNamePipe implements PipeTransform {

  tierList: any = []
  constructor(public dataService: DataService) {
    this.dataService.tierListArray.subscribe(data => {
      this.tierList = data;
    })
  }
  transform(value: any, args?: any): any {
    let text = "";
    if (value) {
      this.tierList.map((tire) => {
        if (tire?.id && value && tire?.id == value) {
          text = tire?.name;
        }
      })

      return text;
    }
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
