import { Component } from '@angular/core';
import { UserService } from 'src/services/user-service.service';
import { UserLogin } from './user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage-service.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  page=0
  size=2
  users: UserLogin[]=[];
  usersNumber: number;
  user: UserLogin;
  
  editUser: UserLogin = {
    id:null,
    username:"",
    password:"",
    role:""
  };
isAdmin: any;

  constructor(private router: Router, private userService: UserService, private storageService :StorageService) { }
  ngOnInit() {

    this.isAdmin = this.storageService.checkAdmin();
    const currentUrl: string = window.location.href;
    console.log('Current URL:', currentUrl);
    const token = window.sessionStorage.getItem("auth-user");
    if (token === null) {
      this.router.navigateByUrl('/signup')
    }
    else{
    this.getAllUsers();}

    }
    
   
  public getAllUsers(): void {
    this.userService.getAllUsers(this.page,this.size).subscribe(
      {
        next: (response: any) => {
          this.users = response.users;
          this.usersNumber=response.totalPages
          console.log(this.users);
          

        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }

  getPageNumbers(): number[] {  
   
    

    return Array.from({ length: this.usersNumber }, (_, index) => index);
  }

  changePage(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllUsers();
  }
  public onUpdateUser(editForm: NgForm): void {


    document.getElementById('update-user-form')?.click();

    console.log("update : ", editForm.value);
    console.log(editForm.value);
    const updatedUser: UserLogin = {
     
      
      id: editForm.value.id,
      role: editForm.value.role

    };
    console.log(updatedUser.id);

    this.userService.updateUser( updatedUser.id , updatedUser).subscribe(
      {
        next: (response: UserLogin) => {
          this.user = response;
          console.log("updated User : " + updatedUser.id);
          console.log("On update id : " + editForm.value.id);
          this.getAllUsers();

        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public onOpenModal(user: UserLogin | null, mode: string): void {
     
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    
   
    if (mode === 'update') {
      this.editUser=user;
      button.setAttribute('data-target', '#updateUser');
    }
    container?.appendChild(button);
    button.click();

  }
}
