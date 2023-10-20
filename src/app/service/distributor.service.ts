import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  API_URL: string = environment.APIEndpoint + 'v1/Users/';

  constructor(
    private http: HttpClient,
  ) { }

  getDistributorList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetDistributors`, param);
  }

  saveDistributor(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  saveLicense(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Licenses/AddLicenses`, data);
  }

  deleteDistributor(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  suspendDistributorById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Suspend?id=${id}`);
  }

  getDistributorById(id): Observable<any> {
    return this.http.get(`${this.API_URL}GetUser?id=${id}`);
  }

  getLicenseByLicenseeCode(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetLicenseByLicenseeCode?licenseeId=${id}`);
  }

  getRenewedLicenses(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetRenewedLicenses?licenseeId=${id}`);
  }

  GetLicensorBalanceById(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetLicensorBalanceById?licenseeId=${id}`);
  }

  saveOneLicense(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Licenses/Save`, data);
  }

  renewLicense(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Licenses/Renew`, data);
  }

  checkExpiredLicense(id:any): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/CheckLicenseExpired?licenseeId=${id}`);
  }
}
