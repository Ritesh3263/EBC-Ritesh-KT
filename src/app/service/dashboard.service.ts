import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  API_URL: string = environment.APIEndpoint + 'v1/Users/';

  constructor(
    private http: HttpClient,
  ) { }

  GetLicensorBalanceById(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetLicensorBalanceById?licenseeId=${id}`);
  }

  GetLicenseforDashboard(id): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Licenses/GetLicenseforDashboard?id=${id}`);
  }

  getGraphData(): Observable<any> {
    return this.http.get(`${environment.APIEndpoint}v1/Dashboard/DashboardClicks`);
  }

}
