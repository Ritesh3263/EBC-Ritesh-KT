import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/app/service/loader.service';
@Component({
  selector: 'fullscreen-loading',
  templateUrl: './fullscreen-loading.component.html',
  styleUrls: ['./fullscreen-loading.component.scss'],
})
export class FullscreenLoadingComponent implements OnInit {

  isLoading: Subject<boolean> = this.loaderService.isLoading;

  constructor(public loaderService: LoaderService) {
  }

  ngOnInit(): void {}
}
