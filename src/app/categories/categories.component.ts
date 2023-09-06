import { Component } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { Category } from './category.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage-service.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../app.component.css', '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class CategoriesComponent {
  page=0
  size=4
  title: any;
  selectedCategory!:Category
  categories: Category[]=[];
  categoryid:number;
  category: Category={
    id : null,
    name: ''
  }
  updatedCategory: Category;
  editCategory: Category = {
    id: null,
    name: ''
  };
  deleteCategory: Category;
  
  categoriesNumber: number;
  isAdmin: boolean;
  showAlert: boolean;
  
  
  


  constructor( private categoryService: CategoryService,private router : Router,private storageService:StorageService) { }
  ngOnInit() {
    this.isAdmin = this.storageService.checkAdmin();
    const token = window.sessionStorage.getItem("auth-user");
    if(token === null) {
      this.router.navigateByUrl("/signup")
    }
    else{
      this.getAllCategoriesPages();
    }
     }
  getPageNumbers(): number[] {  
   
    

    return Array.from({ length: this.categoriesNumber }, (_, index) => index);
  }

  changePage(pageNumber: number): void {
    this.page = pageNumber;
    this.getAllCategoriesPages();
  }
  public getAllCategoriesPages(): void {
    this.categoryService.getAllCategoriesPages(this.page,this.size).subscribe(
      {
        next: (response: any) => {
           this.categories = response.categories;
           this.categoriesNumber=response.totalPages
            console.log(this.categories);
            
            
         },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
 
  onSelectCategory(category: Category) {
    console.log(category)
    this.category.id=category.id
    console.log("this.product.category_id; " +this.category.id);
   
  }

  public onAddCategory(addForm: NgForm): void {
   
    console.log(addForm.value.name);
    
    document.getElementById('add-category-form')?.click();
    
    

   /* let category_: Subscription = this.categoryService.getCategory(parseInt(this.inputCategoryId as string, 10)).subscribe(
      {
        next: (res: Category) => {
          this.category = res
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );*/
    const newCategory: Category = {
      name:addForm.value.name
   };

    this.categoryService.addCategory(newCategory).subscribe(
      {
        next: (response:Category) => {
          console.log("I am in subscribe => ", addForm.value);
          console.log(response);
          this.getAllCategoriesPages();
          addForm.reset();
          this.showAlert = true;
          this.hideAlertAfterTimeout();
        
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }
  public onUpdateCategory(editForm: NgForm): void {
    
    
    document.getElementById('update-category-form')?.click();
    
    console.log("update : ",editForm.value);

    const updatedCategory: Category = {
      
      name: editForm.value.name,
      
      id:editForm.value.id
      
    };
    console.log("editform.value.id" + editForm.value.id);
    
    this.categoryService.updateCategory(updatedCategory.id, updatedCategory).subscribe(
      {
      next: (response: Category) => 
      { this.updatedCategory = response;
        console.log("updated prod : " + updatedCategory.name);
        console.log("On update id : " + editForm.value.id);
        this.getAllCategoriesPages();
        
       },
      error:  (error: HttpErrorResponse) => { alert(error.message); }
    }
    );
  }
  public onDeleteCategory(categoryid: number): void {
    console.log("categry id :" + categoryid);
    
    this.categoryService.deleteCategory(categoryid).subscribe(
      {
        next: (response:void) => {
          console.log(response);
          this.getAllCategoriesPages();
          window.location.reload();
        },
        error: (error: HttpErrorResponse) => { alert(error.message); }
      }
    );
  }

  public onOpenModal(category: Category , mode: string): void {
    
    const container = document.getElementById('main-container')
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-target', '#addCategory');
      
    }

    if (mode === 'delete') {
      this.deleteCategory=category
      button.setAttribute('data-target', '#deleteCategoryModal');
    }
    if (mode === 'update') {
      this.editCategory=category;
      button.setAttribute('data-target', '#updateCategory');
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

  }


