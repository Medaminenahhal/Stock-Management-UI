// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin, UserRegister } from '../app/login-form/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  private apiUrl = 'http://localhost:8080/auth';
  roles: any;
  username: any;
  constructor(private http: HttpClient) { }

  login(UserLogin: UserLogin): Observable<any> {
    let options = { headers: new HttpHeaders().set("Content-Type", "application/json") }
    //let params=new HttpParams().set("username",username).set("password",password);
    return this.http.post<UserLogin>(`${this.apiUrl}/signup`, UserLogin, options);
  }
  register(userRegistre : UserRegister): Observable<any>{
    let options = { headers: new HttpHeaders().set("Content-Type", "application/json") }
    return this.http.post<UserRegister>(`${this.apiUrl}/register`, userRegistre , options);
  }
  loadProfil(data: Object) {
    let jwtToken = data['access-token'];
  }

}

