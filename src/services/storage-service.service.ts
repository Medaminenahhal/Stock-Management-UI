import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService  {
  isAdmin: boolean;
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user:any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const token = window.sessionStorage.getItem(USER_KEY);
    
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the payload
      return payload;
    }

    return null;
  }
 

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
  public cleaning(): void {
    window.sessionStorage.clear();
    //sessionStorage.clear();
  }
  public checkAdmin(): boolean {
    const token = window.sessionStorage.getItem("auth-user");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userRole = tokenPayload.role;
      return this.isAdmin = userRole === "ADMIN"; // Adjust role value as needed
    }
    else return false
  }
  public takeId():number {
    const token = window.sessionStorage.getItem("auth-user");
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const user_id = tokenPayload.id;
      return user_id // Adjust role value as needed
    }
   
  }

}
