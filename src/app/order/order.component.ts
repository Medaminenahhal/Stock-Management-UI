import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/services/category.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { StorageService } from 'src/services/storage-service.service';
import { Order } from './order.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  user_id:number
  isAdmin: boolean;
  productsNumber: number;
  orders: Order[]=[];
  ordersNumber: number;
  page=0
  size=4
  validated:boolean;
  a:Date
  b:Date
  sortedOrders: Order[]=[];
  showAlert: boolean=false;
  constructor(private router: Router, private productService: ProductService, private categoryService: CategoryService, private storageService:StorageService,private orderService: OrderService) { }
  ngOnInit() {
    this.user_id=this.storageService.takeId();
    this.isAdmin = this.storageService.checkAdmin();
    const currentUrl : string = window.location.href;
    console.log('Current URL:', currentUrl);
    const token = window.sessionStorage.getItem("auth-user");
    if(token === null) {
      this.router.navigateByUrl('/signup')
    } else{
    this.getAllOrders();}
    
  }

 
  
  getPageNumbers(): number[] {  
   return Array.from({ length : this.ordersNumber }, (_, index) => index);
  }

  changePage(pageNumber: number): void {
    
    this.page = pageNumber;
    this.getAllOrders();
  }
   updateOrder(order:any):void{
    
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    const updatedOrder: Order = {
      quantity: order.quantity,
      product_id:order.produit.id,
      user_id:order.user.id
      
    };

    console.log("whole order", updatedOrder);
    
    console.log("Order_id:",order.id);
    if(order.state !== "Validated"){
    this.orderService.updateOrder(updatedOrder,order.id).subscribe(
      {
        next: (response: any) => {
           this.orders = response.orders;
           console.log(this.orders);
           this.ordersNumber = response.totalPages;
            console.log(this.ordersNumber);

            this.showAlert = true;
            this.getAllOrders();
            this.hideAlertAfterTimeout();
            
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
     
    );
    container?.appendChild(button);
    button.click();
    
    
    
   }}

  public getAllOrders(): void {
    if (this.isAdmin){
    this.orderService.getAllOrders(this.page,this.size).subscribe(
      {
        next: (response: any) => {
           this.orders = response.orders;
            // Create a copy of the orders array
                      
           console.log("Sorted orders:", this.sortedOrders);
           console.log(this.orders);
           this.ordersNumber = response.totalPages;
           console.log(this.ordersNumber);
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );}
    else{
      this.orderService.getAllOrdersById(this.page,this.size,this.user_id).subscribe(
        {
          next: (response: any) => {
             this.orders = response.orders;
            
              console.log(this.orders);
              this.ordersNumber = response.totalPages;
              console.log(this.ordersNumber);
              
           },
          error: (error: HttpErrorResponse) => { alert(error.message); }
        }
      );

    }
  }
  hideAlertAfterTimeout() {
    setTimeout(() => {
      this.showAlert = false;

      window.location.reload();
    }, 3000);
  }
  parseCustomDate(dateString: string): Date {
    const year = Number(dateString.substring(0, 4));
    const month = Number(dateString.substring(5, 7)) - 1; // Months are zero-based
    const day = Number(dateString.substring(8, 10));
    const hour = Number(dateString.substring(11, 13));
    const minute = Number(dateString.substring(14, 16));
  
    return new Date(year, month, day, hour, minute);
  }
  
}
