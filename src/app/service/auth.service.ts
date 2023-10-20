import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  API_URL: string = environment.APIEndpoint + 'v1/Authentication/';

  constructor(
    private http: HttpClient,
  ) { }

  login(data): Observable<any> {
    return this.http.post(`${this.API_URL}Authenticate`, data);
  }
  forgotPassword(email): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Auth/sendOTP`, {}, { params: email });
  }

  // =====>  End user API with static token
  // endUserLogin(data): Observable<any> {
  //   return this.http.post(`${this.API_URL}DAuthenticate`, data);
  // }
  // getBusinessUnitListEndUser(param, header): Observable<any> {
  //   return this.http.post(`${environment.APIEndpoint}v1/BusinessUnits/GetBusinessUnits`, param, {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${header.token}`
  //     })
  //   });
  // }
  // previewTemplateListEndUser(param, header): Observable<any> {
  //   return this.http.post(`${environment.APIEndpoint}v1/Template/Preview`, {}, {
  //     params: param,
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${header.token}`
  //     })
  //   });
  // }
  // getTenantByCodeEndUser(param, header): Observable<any> {
  //   return this.http.get(`${environment.APIEndpoint}v1/Tenants/GetTenantByCode`, {
  //     params: param,
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${header.token}`
  //     })
  //   });
  // }

  // ==> End user Public API
  cardPreview(data, ip = null): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/UserTemplate/CardPreview`, {}, {
      params: data,
      headers: new HttpHeaders({
        IPAdd: `${ip}`
      })
     });
  }

  sendEnquiryMails(formdata, data ): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/UserTemplate/SendEnquiryMails`, formdata, { params: data } );
  }

}
