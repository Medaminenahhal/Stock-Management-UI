import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment.dev';
import { UserLogin } from 'src/app/users/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiServiceUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  public getAllUsers(page:number,size:number): Observable<UserLogin[]> {
    return this.http.get<UserLogin[]>(`${this.apiServiceUrl}/api/users?page=${page}&size=${size}`)
  }
  public updateUser(userid: Number, user: UserLogin): Observable<UserLogin> {
    return this.http.put<UserLogin>(`${this.apiServiceUrl}/api/users/${userid}`, user);
  }
}
