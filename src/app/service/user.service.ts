import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL: string = environment.APIEndpoint + 'v1/Users/';
  API_URL2: string = environment.APIEndpoint + 'v1/';
  // for storing Loader status
  public loaderSubject = new BehaviorSubject(null);
  public showMasterLoader = this.loaderSubject.asObservable()

  constructor(
    private http: HttpClient,
  ) { 
    this.loaderSubject.next(false);
  }

  getUserList(param = null): Observable<any> {
    return this.http.post(`${this.API_URL}GetUsers`, param);
  }

  saveUser(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  fileUpload(data,param): Observable<any> {
    this.loaderSubject.next(true);
    return this.http.post(`${this.API_URL}BulkUpload`, data,{params:param});
  }

  getUserById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetUser`, { params: param });
  }

  updatePassword(data): Observable<any> {
    return this.http.post(`${this.API_URL}ChangePassword`, {}, { params: data });
  }

  changePassword(data): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Auth/UpdatePassword`, {}, { params: data });
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  getMasterData(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/master-data`);
  }

  checkLoginIdExists(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}CheckLoginIdExists`, { params: param });
  }

  getApproverList(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}DropDownUsers`, { params: param });
  }
 
  getUserData(): Observable<any> {
    return this.http.get(`${this.API_URL2}SocialMedia/GetUserDropDown`);
  }

  userDataDownload(): Observable<any> {
    return this.http.get(`${this.API_URL2}Licenses/UserDataDownload`);
  }

  getBulkUploadStatus(): Observable<any> {
    return this.http.get(`${this.API_URL2}Users/GetBulkUpload`);
  }
}
