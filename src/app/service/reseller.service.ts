import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResellerService {

  API_URL: string = environment.APIEndpoint + 'v1/Users/';

  constructor(
    private http: HttpClient,
  ) { }

  getResellerList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetResellers`, param);
  }

  saveReseller(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  deleteReseller(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  getResellerById(id): Observable<any> {
    return this.http.get(`${this.API_URL}GetUser?id=${id}`);
  }

  suspendResellerById(id): Observable<any> {
    return this.http.get(`${this.API_URL}Suspend?id=${id}`);
  }

}
