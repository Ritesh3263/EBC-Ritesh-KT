import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Inject,
  NgModule,
  PLATFORM_ID,
} from '@angular/core';
import {
  BrowserTransferStateModule,
  TransferState,
} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { TranslateBrowserLoader } from './translate-browser.loader';
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
@NgModule({
  imports: [
    HttpClientModule,
    BrowserTransferStateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient, TransferState, PLATFORM_ID],
      },
    }),
  ],
  exports: [TranslateModule],
})
export class I18nModule {
  constructor(
    translateService: TranslateService,
    @Inject(PLATFORM_ID) private platform: any
  ) {
    translateService.addLangs(environment.language?.map((el) => el.code));

    const browserLang = isPlatformBrowser(this.platform)
      ? (translateService.getLangs().includes(localStorage.getItem('currentLanguage')) ?
        localStorage.getItem('currentLanguage') : environment?.defaultLangCode
      ) ||
      environment?.defaultLangCode ||
      translateService.getBrowserLang()
      : environment?.defaultLangCode;

    translateService.use(browserLang || environment?.defaultLangCode);
  }
}

// export function translateLoaderFactory(
//   httpClient: HttpClient,
//   transferState: TransferState,
//   platform: any
// ) {
//   return isPlatformBrowser(platform)
//     ? new TranslateHttpLoader(httpClient)
//     : '';
// }

// required for AOT compilation
export function translateLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
