import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {

  API_URL: string = environment.APIEndpoint + 'v1/BusinessUnits/';

  constructor(
    private http: HttpClient,
  ) { }

  getBusinessUnitList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetBusinessUnits`, param);
  }

  saveBusinessUnit(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  getBusinessUnitById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetBusinessUnit`, { params: param });
  }
  getBusinessUnitByCode(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetBusinessUnitByCode`, { params: param });
  }

  deleteBusinessUnit(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }
  checkCodeExists(code: string): Observable<any> {
    return this.http.get(`${this.API_URL}CheckCodeExists?code=${code}`);
  }
  // template
  getTemplateList(param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Template/GetTemplates`, param);
  }
  previewTemplateList(param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Template/Preview`, {}, { params: param });
  }

  docReaderOCR(file, param): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Ocr/ReadBusinessCardOCR`, file);
  }

  // apple-wallet
  getAppleWalletPassLink(param): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Wallet/AppleWallet`, { params: param });
  }

}
