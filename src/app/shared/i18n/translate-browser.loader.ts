import { Observable, of } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export class TranslateBrowserLoader implements TranslateLoader {
  constructor(
    private transferState: TransferState,
    private http: HttpClient,
    private prefix: string = '/assets/i18n/',
    private suffix: string = '.json?cb=' + Date.now()
  ) { }

  public getTranslation(lang: string): Observable<any> {
    const key = makeStateKey<any>('transfer-translate-' + lang);
    const data = this.transferState.get(key, null);

    // First we are looking for the translations in transfer-state, if none found, http load as fallback
    return data
      ? of(data)
      : new TranslateHttpLoader(
        this.http,
        this.prefix,
        this.suffix
      ).getTranslation(lang);
  }
}
