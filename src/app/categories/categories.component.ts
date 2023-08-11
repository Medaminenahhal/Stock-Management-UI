import { Component } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { Category } from './category.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['../app.component.css', '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class CategoriesComponent {
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
  private _category: Category;
  categoriesNumber: number;
  
  


  constructor( private categoryService: CategoryService,private router : Router) { }
  ngOnInit() {
    const token = window.sessionStorage.getItem("auth-user");
    if(token === null) {
      this.router.navigateByUrl("/signup")
    }
      this.getAllCategories();
     

    
  }
  public getAllCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      {
        next: (response: Category[]) => {
           this.categories = response;
            console.log(this.categories);
            this.categoriesNumber = this.categories.length;
            
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
          this.getAllCategories();
          addForm.reset();
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
        this.getAllCategories();
        
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
          this.getAllCategories();
          
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

  }


