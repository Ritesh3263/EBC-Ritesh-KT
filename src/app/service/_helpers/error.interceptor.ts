import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from 'src/app/service/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActionPopupComponent } from 'src/app/core/action-popup/action-popup.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dateService: DataService, private router: Router,  public dialog: MatDialog) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {
      if (error.status === 401) {
        // auto logout if 401 response returned from api
        this.dateService.purgeAuth();
        const dialogRef = this.dialog.open(ActionPopupComponent, {
          width: '530px',
          height: '320px',
          data: { isSessionTimeOut: true },
          panelClass: 'timeout',
          disableClose: true,
        });
         setTimeout(() => {
          this.dialog.closeAll();
          this.router.navigateByUrl('/login');
         }, 2000);
      }
      return throwError(error);
    }));
  }
}
