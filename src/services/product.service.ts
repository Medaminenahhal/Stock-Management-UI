import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environment/environment.dev';
import { Product } from 'src/app/products/product.model';
@Injectable({providedIn: 'root'})
export class ProductService {
    private apiServiceUrl = environment.apiBaseUrl;
    
    constructor(private http: HttpClient){ }
    public getAllProducts():Observable<Product[]>{
        return this.http.get<Product[]>(`${this.apiServiceUrl}/api/produits`)
    }
   

    public addProduct(product : Product):Observable<Product>{
        return this.http.post<Product>(`${this.apiServiceUrl}/api/produits`,product);
    }

    public updateProduct(product : Product,productid : Number):Observable<Product>{
        return this.http.put<Product>(`${this.apiServiceUrl}/api/produits/${productid}`, product);
    }

    public deleteProduct(productid : number):Observable<void>{
        return this.http.delete<void>(`${this.apiServiceUrl}/api/produits/${productid}`);
    }

}