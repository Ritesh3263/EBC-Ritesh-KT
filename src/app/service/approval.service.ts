import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalService {

  API_URL: string = environment.APIEndpoint + 'v1/BusinessCard/';

  constructor(
    private http: HttpClient,
  ) { }

  getApprovalList(data): Observable<any> {
    return this.http.post(`${this.API_URL}GetApprovalRequests`, data);
  }

  submitApproval(param): Observable<any> {
    return this.http.get(`${this.API_URL}RequestApproval_Reject`, { params: param });
  }

  getApprovedList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetApprovalLogs`, param);
  }

  getRequestLogsList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetRequestLogs`, param);
  }

}
