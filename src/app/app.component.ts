import { Component } from '@angular/core';
import { Product } from './products/product.model';
import { Category } from './categories/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage-service.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
 title: any;
 products : Product[];
 categories : Category[];
 constructor( private router:Router, private storageService : StorageService) { };
 productsNumber: number;
 categoriesNumber: number;

  ngOnInit() {
      
      
    let existingToken = window.sessionStorage.getItem("auth-user");
    if(existingToken==null){
     this.router.navigateByUrl('/signup')
    }
   }

   logOut():void{

    this.storageService.cleaning();
    window.location.reload();
  }
  }
  
    

    
  
  
 
 
