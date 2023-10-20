import { Injectable } from '@angular/core';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { JwtService } from './jwt.service';
import { encryptValue } from '../shared/common';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  // for storing current user details
  public currentUserSubject = new BehaviorSubject(null);
  public currentUser = this.currentUserSubject.asObservable()

  // for tierId to userLicense details
  public tierListArraySubject = new BehaviorSubject(null);
  public tierListArray = this.tierListArraySubject.asObservable()

  // for checking user is authneticated or not
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  // for storing current Tenant details
  public currentTenantSubject = new BehaviorSubject(null);
  public currentTenant = this.currentTenantSubject.asObservable()

  // for storing current company details
  public currentBUSubject = new BehaviorSubject(null);
  public currentBU = this.currentBUSubject.asObservable()

  // for checking company is selected or not
  private isCompanySelectedSubject = new BehaviorSubject<boolean>(false);
  public isCompanySelected = this.isCompanySelectedSubject.asObservable();

  // for storing common lists details
  private commonListSubject = new BehaviorSubject(null);
  public commonList = this.commonListSubject.asObservable()

  // for storing current user permission details
  public userPermissionSubject = new BehaviorSubject(null);
  public permission = this.userPermissionSubject.asObservable()

  // for storing current company details
  public forgatAuthSubject = new BehaviorSubject(null);
  public forgatAuth = this.forgatAuthSubject.asObservable()

// for storing current user details
public formOCRSubject = new BehaviorSubject(null);
public formOCR = this.formOCRSubject.asObservable()

  // for storing selectedBU
  public selectedBU = new BehaviorSubject(null);
  public BU = this.selectedBU.asObservable()

  // for passing id from add-cards to cards-list
  public currentIdSubject = new BehaviorSubject(null);
  authUser: any;
  refreshTokenTimeout: any;

  public licanseWarningSubject = new BehaviorSubject(null);
  public licanseWarning = this.licanseWarningSubject.asObservable()

  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) { }

  saveToken(token) {
    this.jwtService.saveToken(encryptValue(token));
  }
  saveRefreshToken(token) {
    this.jwtService.saveRefreshToken(encryptValue(token));
  }

  saveCommonList(data) {
    this.commonListSubject.next(data);
  }

  setAuth(data) {
    this.saveToken(data['jwtToken']);
    this.saveRefreshToken(data['refreshToken']);
    this.authUser = data;
    this.updateAuth({ ...data.user, userType: data.userType, roleList: this.getRole(data.userType), tenantCode: data.tenantCode });
    this.updatePermission(data.permissions);
    // this.startRefreshTokenTimer();
  }
  refreshAuth(data) {
    this.updateAuth({ ...data.user, userType: data.userType, roleList: this.getRole(data.userType), tenantCode: data.tenantCode });
    this.updatePermission(data.permissions);
  }
  getRole = (userType) => {
    switch (userType) {
      case 'Super Admin': return ['Super Admin'];
      case 'Tenant Admin': return ['BU Admin', 'End User'];
      case 'BU Admin': return ['End User'];
      case 'End User': return ['End User'];
    }
  } //'Tenant Admin'

  updateAuth(data) {
    this.currentUserSubject.next(data);
    this.isAuthenticatedSubject.next(true);
  }

  updatePermission(data) {
    this.userPermissionSubject.next(data);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.jwtService.destroyRefreshToken();
    // this.stopRefreshTokenTimer();
    // Set auth status to false
    this.authUser = null;
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.userPermissionSubject.next([]);
    this.purgeCompany();
  }

  pushId(data) {
    this.currentIdSubject.next(data);
  }

  fetchId() {
    return this.currentIdSubject.asObservable();
  }

  // updateCompany(data) {
  // this.currentTenantSubject.next(data);
  //   this.jwtService.saveCompanyId(data.company_id);
  //   this.jwtService.saveCompanyName(data.company_name);
  // this.isCompanySelectedSubject.next(true);
  // }

  purgeCompany() {
    // this.jwtService.destroyCompanyId();
    // this.jwtService.destroyCompanyName();
    this.currentTenantSubject.next(null);
    this.isCompanySelectedSubject.next(false);
  }

  // startRefreshTokenTimer() {
  //   if (this.authUser && this.authUser.jwtToken) {
  //     const jwtToken = JSON.parse(atob(this.authUser.jwtToken.split('.')[1]));
  //     console.log("jwtToken", jwtToken);

  //     const expires = new Date(jwtToken.exp * 1000);
  //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
  //     this.test(timeout);
  //     this.refreshTokenTimeout = setTimeout(() => this.commonService.refreshToken().subscribe(), timeout);

  //   }
  // }
  // test(timeout) {
  //   let ms = timeout,
  //     min = Math.floor((ms / 1000 / 60) << 0),
  //     sec = Math.floor((ms / 1000) % 60);
  //   console.log(" refreshTokenTimeout", min + ':' + sec);
  // }
  // stopRefreshTokenTimer() {
  //   clearTimeout(this.refreshTokenTimeout);
  // }
}
