import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { decryptValue } from '../shared/common';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isShort: boolean;
  API_URL: string = environment.APIEndpoint;

  constructor(
    private http: HttpClient,
    private jwt: JwtService
  ) { }

  fileUpload(file) {
    return this.http.post(`${this.API_URL}v1/FileUpload/Upload`, file).toPromise();
  }

  appleFileUpload(file) {
    return this.http.post(`${this.API_URL}v1/FileUpload/AppleFileUpload`, file).toPromise();
  }

  GetCurrentUserProfile(): Observable<any> {
    return this.http.get(`${this.API_URL}v1/Authentication/GetCurrentUserProfile`);
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RefreshToken`, { 'refreshToken': decryptValue(this.jwt.getRefreshToken()) }, { withCredentials: true });
  }

  logout(token): Observable<any> {
    return this.http.post(`${this.API_URL}v1/Authentication/RevokeToken`, { 'refreshToken': token });
  }

  sortData(filedName: any = '', ArrayList: any = []) {
    const data = ArrayList.slice();
    ArrayList = data.sort((a, b) => {
      return (a[filedName] < b[filedName] ? -1 : 1) * (this.isShort ? 1 : -1);
    });
    return ArrayList;
  }
}
