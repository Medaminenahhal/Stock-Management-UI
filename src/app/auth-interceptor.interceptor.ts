import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authUser = sessionStorage.getItem('auth-user'); // Retrieve the token from storage
    const authUserObject = JSON.parse(authUser);
    let token = "";
    if(authUser != null && authUserObject != null){
      token = authUserObject.token;
      console.log(token);
      
    }

    if (token) {
      // Clone the request and attach the token as an Authorization header
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: ` Bearer ${token} `
        }
      });
       console.log("im in interceptor");
       
      return next.handle(clonedRequest);
    } else {
      
      return next.handle(request);
    }
  }
}

