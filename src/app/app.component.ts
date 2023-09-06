import { Component } from '@angular/core';
import { Product } from './products/product.model';
import { Category } from './categories/category.model';
import {  Router } from '@angular/router';
import { StorageService } from 'src/services/storage-service.service';
import { ProductService } from 'src/services/product.service';
import { CategoryService } from 'src/services/category.service';
import { UserService } from 'src/services/user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserLogin } from './users/user.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 title: any;
 page=0
 size=2
 products : Product[];
 categories : Category[];
  users: UserLogin[];
  search: string='';
 constructor( private router:Router, private storageService : StorageService, private productService: ProductService,private categoryService: CategoryService, private userService: UserService ) { };
 productsNumber: number;
 categoriesNumber: number;
 usersNumber:number;
 existingToken:any
 isAdmin:any

  ngOnInit() {
     this.isAdmin= this.storageService.checkAdmin()
    this.existingToken = window.sessionStorage.getItem("auth-user");
    if(this.existingToken==null){
     this.router.navigateByUrl('/signup')
    }
    else{
    this.allUsers();
    this.allProducts();
    this.categoryService.getAllCategoriesPages(this.page,this.size).subscribe(
      {
        next:(response : any ) => {
           
          this.categoriesNumber = response.totalItems;
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
    
   }}
   
   logOut():void{

    this.storageService.cleaning();
    window.location.reload();}

    allUsers(){
      this.userService.getAllUsers(this.page,this.size).subscribe(
        {
          next: (response:any) => {
            
            this.usersNumber = response.totalItems;
  
          },
          error: (error: HttpErrorResponse) => { alert(error.message); }
        }
      );
    }

    allProducts(){
      this.productService.getAllProducts(this.page,this.size,this.search).subscribe(
        {
          next: (response: any) => {
             this.productsNumber = response.totalItems;
              console.log("products number :" ,this.productsNumber);
              
              
           },
          error: (error: HttpErrorResponse) => { alert(error.message); }
        }
      );
    }
   
  
   
  }

  



  
  
    

    
  
  
 
 
