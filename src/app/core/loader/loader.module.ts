import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { FullscreenLoadingComponent } from './fullscreen-loading/fullscreen-loading.component';

@NgModule({
  declarations: [
    LoadingComponent,
    FullscreenLoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    FullscreenLoadingComponent
  ],
})
export class LoaderModule {

}
