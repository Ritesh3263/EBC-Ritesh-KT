import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  getToken(): string {
    return window.localStorage['_auth_ebc'];
  }

  saveToken(token: string) {
    window.localStorage['_auth_ebc'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('_auth_ebc');
  }

  getCompanyId(): string {
    return window.localStorage['__ebc__cmp'];
  }

  saveCompanyId(id: any) {
    window.localStorage['__ebc__cmp'] = id;
  }

  destroyCompanyId() {
    window.localStorage.removeItem('__ebc__cmp');
  }

  getCompanyName(): string {
    return window.localStorage['__ebc__cmp_nm'];
  }

  saveCompanyName(name: any) {
    window.localStorage['__ebc__cmp_nm'] = name;
  }

  destroyCompanyName() {
    window.localStorage.removeItem('__ebc__cmp_nm');
  }

  saveValue(name, value) {
    window.localStorage[name] = value;
  }

  destroyValue(name) {
    window.localStorage.removeItem(name);
  }

  getValue(name): string {
    return window.localStorage[name]; // window.localStorage['google_token'];
  }

  // refreshToken
  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  saveRefreshToken(token: string) {
    window.localStorage['refreshToken'] = token;
  }

  destroyRefreshToken() {
    window.localStorage.removeItem('refreshToken');
  }
}
