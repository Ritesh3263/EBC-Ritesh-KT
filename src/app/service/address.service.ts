import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  API_URL: string = environment.APIEndpoint + 'v1/Address/';

  constructor(
    private http: HttpClient,
  ) { }

  getAddressList(param): Observable<any> {
    return this.http.post(`${this.API_URL}GetAddresses`, param);
  }

  saveAddress(data): Observable<any> {
    return this.http.post(`${this.API_URL}Save`, data);
  }

  getAddressById(param = null): Observable<any> {
    return this.http.get(`${this.API_URL}GetAddress`, { params: param });
  }

  deleteAddress(id): Observable<any> {
    return this.http.delete(`${this.API_URL}Delete?id=${id}`);
  }

}
