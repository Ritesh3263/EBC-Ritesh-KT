import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  API_URL: string = environment.APIEndpoint + 'v1/Tenants/';

  constructor(
    private http: HttpClient,
  ) { }

  getTenantList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetTenants`, param);
  }

  saveTenant(data, licenseType): Observable<any> {
    return this.http.post(`${this.API_URL}Save?licenseType=${licenseType}`, data);
  }

  deleteUser(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

  getTenantById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetTenant`, { params: param });
  }

  getTiers(params): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Tiers/GetTiers`, params);
  }
  checkCodeExists(code: string): Observable<any> {
    return this.http.get(`${this.API_URL}CheckCodeExists?code=${code}`);
  }
  getTenantByCodeEndUser(param): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Tenants/GetTenantByCode`, { params: param });
  }
  getLicenseWarning(userId){
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetLicenseWarning?userId=${userId}`);
  }
  suspendTenantById(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Users/Suspend?id=${id}`);
  }
  renewLicense(id): Observable<any> {
    return this.http.post(`${environment.APIEndpoint}v1/Licenses/Renew?id=${id}`, { id: id });
  }
}
