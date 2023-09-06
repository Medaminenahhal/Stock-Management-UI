import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category } from "src/app/categories/category.model";
import { environment } from "src/app/environment/environment.dev";

@Injectable({providedIn: 'root'})
export class CategoryService {
    private apiServiceUrl = environment.apiBaseUrl;
    
    constructor(private http: HttpClient){ }
    public getAllCategoriesPages(page:number,size:number):Observable<Category[]>{
        return this.http.get<Category[]>(`${this.apiServiceUrl}/api/category?page=${page}&size=${size}`)
    }
    public getAllCategories():Observable<Category[]>{
        return this.http.get<Category[]>(`${this.apiServiceUrl}/api/category/list`)
    }
    public getCategory (category_id:number):Observable<any>{
        return this.http.get<Category>(`${this.apiServiceUrl}/api/category/${category_id}`)
    }

    public addCategory(category : Category):Observable<Category>{
        return this.http.post<Category>(`${this.apiServiceUrl}/api/category`,category);
    }

    public updateCategory(categoryid : Number, category : Category):Observable<Category>{
        return this.http.put<Category>(`${this.apiServiceUrl}/api/category/${categoryid}`, category);
    }

    public deleteCategory(category_id : number):Observable<void>{
        return this.http.delete<void>(`${this.apiServiceUrl}/api/category/${category_id}`);
    }



}