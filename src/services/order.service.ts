import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment.dev';
import { Order } from 'src/app/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiServiceUrl = environment.apiBaseUrl;
    
  constructor(private http: HttpClient){ }
  public getAllOrders(page:number,size:number):Observable<Order[]>{
      return this.http.get<Order[]>(`${this.apiServiceUrl}/api/orders?page=${page}&size=${size}`)
  }
  public getAllOrdersById(page:number,size:number,user_id:number):Observable<Order[]>{
    return this.http.get<Order[]>(`${this.apiServiceUrl}/api/orders/${user_id}?page=${page}&size=${size}`)
}
public addOrder(order:Order):Observable<Order>{
  return this.http.post<Order>(`${this.apiServiceUrl}/api/orders`,order)
}
public updateOrder(order:Order,order_id: number):Observable<Order>{
  return  this.http.put<Order>(`${this.apiServiceUrl}/api/orders/${order_id}`,order)
}
}
