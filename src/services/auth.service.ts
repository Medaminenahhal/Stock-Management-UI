// auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin, UserRegister } from '../app/users/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: boolean = false;
  private apiUrl = 'http://localhost:8080/auth';
  roles: any;
  username: any;
  
  constructor(private http: HttpClient) { }

  private isAdmin = false;

 
  
  login(UserLogin: UserLogin): Observable<any> {
    let options = { headers: new HttpHeaders().set("Content-Type", "application/json") }
    
    
    //let params=new HttpParams().set("username",username).set("password",password);
    return this.http.post<UserLogin>(`${this.apiUrl}/signin`, UserLogin, options);
  }
  register(userRegistre: UserRegister): Observable<any> {
    let options = {headers: new HttpHeaders().set("Content-Type", "application/json")}
    //let params=new HttpParams().set("username",userRegistre.username).set("password",userRegistre.password).set("fName",userRegistre.fName).set("lName",userRegistre.lName);
    return this.http.post<UserRegister>(`${this.apiUrl}/register`, userRegistre, options);
  }
  loadProfil(data: Object) {
    let jwtToken = data['access-token'];
  }
  

 }
 



