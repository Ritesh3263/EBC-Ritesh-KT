import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  API_URL: string = environment.APIEndpoint + 'v1/Card/';

  constructor(
    private http: HttpClient,
  ) { }

  getCardsList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetCardTemplates`, param);
  }

  saveCards(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  getCardMetaData(params): Observable<any> {
    return this.http.post(`${this.API_URL}GetCardMetadatas`, params);
  }

  getDefaultAttributesList(param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/AttributesMetadata/GetAttributes`, param);
  }

  shareCard(data, param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Authentication/shareCard`, data, { params: param });
  }

}
