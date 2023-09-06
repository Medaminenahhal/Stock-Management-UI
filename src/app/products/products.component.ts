import { Component } from '@angular/core';
import { Product } from './product.model';
import { Category } from '../categories/category.model';
import { ProductService } from 'src/services/product.service';
import { CategoryService } from 'src/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage-service.service';
import { Order } from '../order/order.model';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['../app.component.css', '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class ProductsComponent {
  public products: Product[] = [];
  title: any;
  selectedCategory!:Category
  categories: Category[]=[];
  categoryid:number;
  category: Category = {
    id: null,
    name: ''
  };
  

  product: Product = {
    id:null,
    name: "",
    price: null,
    category_id:null
  };
  editProduct: Product={
    id:null,
    name: "",
    price: null,
    category_id:null
  };
 deleteProduct: Product={
    id:null,
    name: "",
    price: null,
    category_id:null
  };
  order : Order={
     id:null,
     quantity:null,
     product_id:null,
     user_id:null
  }
  productsNumber: number;
  isAdmin: boolean;
  page=0
  size=4
  addedOrder: Order;
  user_id: number;
  selectedProductId:number
  showAlert: boolean = false;
  showAlertForEdit: boolean = false;
  showAlertForDelete: boolean = false;
  
  constructor(private router: Router, private productService: ProductService, private categoryService: CategoryService, private storageService:StorageService,private orderService:OrderService) { }
  searchTerm: string = ''; // Add this property

  searchProducts(): void {
    this.page=0
      this.productService.getAllProducts(this.page, this.size, this.searchTerm).subscribe(
          {
              next: (response: any) => {
                  this.products = response.products;
                  this.productsNumber = response.totalPages;
              },
              error: (error: HttpErrorResponse) => { alert(error.message); }
          }
      );
  }
  ngOnInit() {
    this.user_id=this.storageService.takeId();
    this.isAdmin = this.storageService.checkAdmin();
    const currentUrl : string = window.location.href;
  console.log('Current URL:', currentUrl);
    const token = window.sessionStorage.getItem("auth-user");
    if(token === null) {
      this.router.navigateByUrl('/signup')
    } 
    else{
    this.getAllProducts();
    this.getAllCategories();
       }
  }
  getPageNumbers(): number[] {  
   return Array.from({ length: this.productsNumber }, (_, index) => index);
  }

  changePage(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllProducts();
  }
  public getAllProducts(): void {
   
    this.productService.getAllProducts(this.page,this.size,this.searchTerm).subscribe(
      {
        next: (response: any) => {
           this.products = response.products;
            console.log(this.products);
            this.productsNumber = response.totalPages;
            console.log(this.productsNumber);
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      {
        next: (response: any) => 
        { 
          this.categories = response; 
          console.log(this.categories);
          
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  onSelectCategory(category: Category) {
    console.log(category)
    this.product.category_id=category.id
    console.log("this.product.category_id; " +this.product.category_id);
    
  }

  public onAddProduct(addForm : NgForm): void {
    const priceText: string = addForm.value.price;
    console.log(priceText);
    addForm.value.price = parseFloat(priceText);
    document.getElementById('add-product-form')?.click();
    console.log(addForm.value);
    console.log("category id :", addForm.value.category.id);

    const newProduct: Product = {
      name: addForm.value.name,
      price: addForm.value.price,
      quantity: addForm.value.quantity,
     category_id:addForm.value.category.id
      
   };
   
    this.productService.addProduct(newProduct).subscribe(
      {
        next: (response:Product) => {
          console.log("I am in subscribe => ", addForm.value);
          console.log(response);
          this.getAllProducts();
          addForm.reset();
          this.showAlert = true;
          this.hideAlertAfterTimeout();
          //
           
          
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public onAddOrder(addOrderForm: NgForm): void {
    const quantity: number = addOrderForm.value.quantity;
    console.log(quantity);
    document.getElementById('add-order-form')?.click();
    console.log(addOrderForm.value);

    const newOrder: Order = {
      quantity: addOrderForm.value.quantity,
      product_id:this.selectedProductId,
      user_id:this.user_id
      
    };
    console.log("new order ", newOrder);
    

    this.orderService.addOrder(newOrder).subscribe(
      {
        next: (response:Order) => {
          console.log("I am in subscribe => ", addOrderForm.value);
          console.log(response);
          this.getAllProducts();
          addOrderForm.reset();
          this.showAlert = true;
          this.hideAlertAfterTimeout();
          //window.location.reload();
         
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public onUpdateEmloyee(editForm: NgForm): void {
    
    
    document.getElementById('update-product-form')?.click();
    
    console.log("update : ",editForm.value);
    

    const updatedProduct: Product = {
      id: editForm.value.id,
      name: editForm.value.name,
      price: editForm.value.price,
      quantity: editForm.value.price,
      category_id:editForm.value.category.id
      
    };
    console.log(updatedProduct.category_id);
    
    this.productService.updateProduct(updatedProduct, updatedProduct.id).subscribe(
      {
      next: (response: Product) => 
      { this.product = response;
        console.log("updated prod : " + updatedProduct.name);
        console.log("On update id : " + editForm.value.id);
       
        this.showAlertForEdit = true;
        this.getAllProducts();
        this.hideAlertAfterTimeout();
        
       },
      error:  (error: HttpErrorResponse) => { alert(error.message); }
    }
    );
  }
  public onDeleteProduct(productid: number): void {
    this.productService.deleteProduct(productid).subscribe(
      {
        next: (response:void) => {
          console.log(response);
          
          this.showAlertForDelete = true;
          this.getAllProducts();
          this.hideAlertAfterTimeout();
          //window.location.reload();
          
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }

  public onOpenModal(product: Product | null, mode: string): void {
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addProduct');
      
    }

    if (mode === 'delete') {
      this.deleteProduct=product
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }
    if (mode === 'update') {
      this.editProduct=product;
      button.setAttribute('data-target', '#updateProduct');
    }
    if (mode === 'addOrder') {
      this.selectedProductId = product.id;
      button.setAttribute('data-target', '#addOrder');
      
    }
    container?.appendChild(button);
    button.click();

  }
  hideAlertAfterTimeout() {
    setTimeout(() => {
      this.showAlert = false;
      window.location.reload();
    }, 3000);
  }
  hideAlertEditAfterTimeout() {
    setTimeout(() => {
      this.showAlertForEdit = false;
      window.location.reload();
    }, 3000);
  }
  hideAlertDeleteAfterTimeout() {
    setTimeout(() => {
      this.showAlertForDelete = false;
      window.location.reload();
    }, 3000);
  }
 

}


