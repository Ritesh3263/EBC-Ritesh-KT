import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BusinessUnitService } from 'src/app/service/business-unit.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  @Output() close = new EventEmitter<any>();
  docFile: File;

  constructor(private dataService: DataService, private location: Location, private router: Router, private businessUnitService: BusinessUnitService) { }

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  // public videoOptions: MediaTrackConstraints = {
  //   // width: {ideal: 1024},
  //   // height: {ideal: 576}
  // };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  submitConfirmImage(webcamImage) {
    const arr = webcamImage.imageAsDataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.docFile = new File([u8arr], 'doc.png', { type: webcamImage['_mimeType'] })
    const formData = new FormData();
    const param: any = {};
    formData.append('file', this.docFile);
    this.businessUnitService.docReaderOCR(formData, param).subscribe((res) => {
      this.dataService.formOCRSubject.next(res.data);
      if (Object.keys(res.data).length >= 5) {
        this.router.navigate(['/my-cards/scan-card']);
      } else {
        this.pictureTaken.emit(webcamImage);
      }

    });
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.submitConfirmImage(webcamImage);
    //this.pictureTaken.emit(webcamImage);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public width: number;
  public height: number;

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    this.width = win.innerWidth;
    this.height = win.innerHeight;
  }

  closeCamera(): void {
    this.close.emit(true);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
  facingMode: string = 'environment';// Set rear camera
  // facingMode: string = 'user';  //Set front camera

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }
}
