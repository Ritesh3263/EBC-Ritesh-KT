import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './camera.component';


@NgModule({
  declarations: [CameraComponent],
  imports: [
    CommonModule,
    WebcamModule,
  ], exports: [CameraComponent]
})
export class CameraModule { }
