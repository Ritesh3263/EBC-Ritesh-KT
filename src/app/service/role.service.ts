import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  API_URL: string = environment.APIEndpoint + 'v1/Roles/';

  constructor(
    private http: HttpClient,
  ) { }

  getRoleList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetRoles`, param);
  }

  saveRole(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  deleteRole(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  getModules(data, param, isList): Observable<any> {
    if (isList)
      return this.http.post(`${environment.APIEndpoint}v1/Modules/GetModules`, data, { params: param });
    else
      return this.http.get(`${environment.APIEndpoint}v1/Modules/GetModule`, { params: param });
  }

  getRoleById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetRole`, { params: param });
  }

}
