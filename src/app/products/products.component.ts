import { Component } from '@angular/core';
import { Product } from './product.model';
import { Category } from '../categories/category.model';
import { ProductService } from 'src/services/product.service';
import { CategoryService } from 'src/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
  productsNumber: number;

  constructor(private router: Router, private productService: ProductService, private categoryService: CategoryService) { }
  ngOnInit() {
    const currentUrl : string = window.location.href;
  console.log('Current URL:', currentUrl);
    const token = window.sessionStorage.getItem("auth-user");
    if(token === null) {
      this.router.navigateByUrl('/signup')
    } 
    this.getAllProducts();
    this.getAllCategories();
  }
  public getAllProducts(): void {
    this.productService.getAllProducts().subscribe(
      {
        next: (response: Product[]) => {
           this.products = response;
            console.log(this.products);
            this.productsNumber = this.products.length;
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      {
        next: (response: Category[]) => 
        { this.categories = response;
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

  public onAddProduct(addForm: NgForm): void {
    const priceText: string = addForm.value.price;
    console.log(priceText);
    addForm.value.price = parseFloat(priceText);
    document.getElementById('add-product-form')?.click();
    console.log(addForm.value);
    console.log("category id :", addForm.value.category.id);

   /* let category_: Subscription = this.categoryService.getCategory(parseInt(this.inputCategoryId as string, 10)).subscribe(
      {
        next: (res: Category) => {
          this.category = res
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );*/
    const newProduct: Product = {
      name: addForm.value.name,
      price: addForm.value.price,
     category_id:addForm.value.category.id
      
    };

    this.productService.addProduct(newProduct).subscribe(
      {
        next: (response:Product) => {
          console.log("I am in subscribe => ", addForm.value);
          console.log(response);
          this.getAllProducts();
          addForm.reset();
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
      category_id:editForm.value.category.id
      
    };
    console.log(updatedProduct.category_id);
    
    this.productService.updateProduct(updatedProduct, updatedProduct.id).subscribe(
      {
      next: (response: Product) => 
      { this.product = response;
        console.log("updated prod : " + updatedProduct.name);
        console.log("On update id : " + editForm.value.id);
        this.getAllProducts();
        
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
          this.getAllProducts();
          
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
    container?.appendChild(button);
    button.click();

  }
 

}


