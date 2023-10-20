import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../data.service';
@Injectable({
  providedIn: 'root'
})

export class EnsureAuthenticated implements CanActivate {
  currentUser: any;
  constructor(private router: Router, private dataService: DataService) {
    this.dataService.currentUser.subscribe((data) => {
      if (data) {
        this.currentUser = data;
      }
    })
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let temp = this.currentUser;
    if (localStorage.getItem('_auth_ebc')) {
      return true;
    }
    if (temp && temp.userType && temp.userType == "Super Admin") {
      this.router.navigate(['/login'], { queryParams: { isAdmin: true } });
    } else {
      this.router.navigate(['/login'], { queryParams: { next: encodeURI(state.url) } });
    }

    return false;
  }
}
