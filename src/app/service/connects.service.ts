import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectsService {

  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
  ) { }

  addConnects(data): Observable<any> {
    return this.http.post(`${this.API_URL}/connects`, data);
  }

  editConnects(id, data): Observable<any> {
    return this.http.put(`${this.API_URL}/connects/${id}`, data);
  }

  getConnectsById(id, param = null): Observable<any> {
    return this.http.get(`${this.API_URL}/connects/${id}`, { params: param });
  }

  getMasterData(): Observable<any> {
    return this.http.get(`${this.API_URL}/connects/master-data`);
  }

  // End User - Connect

  getCompanies(param): Observable<any> {
    return this.http.get(`${this.API_URL}v1/BusinessCard/GetCompanies`, { params: param });
  }

  saveBusinessCard(data): Observable<any> {
    return this.http.post(`${this.API_URL}v1/BusinessCard/Save`, data);
  }

  getBusinessCards(param, data): Observable<any> {
    return this.http.post(`${this.API_URL}v1/BusinessCard/GetBusinessCards`, data, { params: param });
  }

  deleteBusinessCardsById(id, param = null): Observable<any> {
    return this.http.delete(`${this.API_URL}v1/BusinessCards/${id}`, { params: param });
  }

  getRequestDownload(data): Observable<any> {
    return this.http.post(`${this.API_URL}v1/BusinessCard/RequestDownload`, data);
  }

}
