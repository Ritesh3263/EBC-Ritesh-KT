import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  API_URL: string = environment.APIEndpoint + 'v1/Reports/';
  API_URL1: string = environment.APIEndpoint + 'v1/';

  constructor(
    private http: HttpClient,
  ) { }

  getInventoryReports(param, userType, isDownload, fromDate, toDate): Observable<any> {
    return this.http.post(`${this.API_URL}InventoryReports?userType=${userType}&isDownload=${isDownload}&toDate=${toDate}&fromDate=${fromDate}`, param);
  }

  getActiveReports(param, userType, isDownload, fromDate, toDate): Observable<any> {
    return this.http.post(`${this.API_URL}ActivationReport?userType=${userType}&isDownload=${isDownload}&toDate=${toDate}&fromDate=${fromDate}`, param);
  }

  getExpireReports(param, isDownload, fromDate, toDate): Observable<any> {
    return this.http.post(`${this.API_URL}ExpiryReports?isDownload=${isDownload}&toDate=${toDate}&fromDate=${fromDate}`, param);
  }

  getCardUsage(param, isDownload): Observable<any> {
    return this.http.post(`${this.API_URL1}TenantlevelReports/BusinessCardUsage?isDownload=${isDownload}`, param);
  }

  getLicenseUsage(param, isDownload): Observable<any> {
    return this.http.post(`${this.API_URL1}TenantlevelReports/LicenseUsage?isDownload=${isDownload}`, param);
  }

  getLoginUsage(param, isDownload): Observable<any> {
    return this.http.post(`${this.API_URL1}TenantlevelReports/LoginUsage?isDownload=${isDownload}`, param);
  }

  getbuList(): Observable<any> {
    return this.http.post(`${this.API_URL1}TenantlevelReports/BUList`, '');
  }

}
