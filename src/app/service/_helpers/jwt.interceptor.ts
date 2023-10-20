import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../jwt.service';
import { decryptValue } from 'src/app/shared/common';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    if (request.body && request.body.open_api && request.body.token) {
      // if (request.body.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${request.body.token}`
        }
      });
      // }

    } else {
      const token = this.jwtService.getToken();
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${decryptValue(this.jwtService.getToken())}`
          }
        });

      }
    }
    return next.handle(request);
  }
}
