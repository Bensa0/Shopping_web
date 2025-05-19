import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../Interfaces/order';
import { OrderCreateDTO } from '../InterfacesDTO/OrderDTO';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiServerUrl}/order/all`, { headers: this.getHeaders() });
  }

  createOrder(orderDTO: OrderCreateDTO): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/order/create`, orderDTO, { headers: this.getHeaders() });
  }

  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiServerUrl}/order/${orderId}`, { headers: this.getHeaders() });
  }

  updateOrder(orderId: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiServerUrl}/order/${orderId}`, order, { headers: this.getHeaders() });
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/order/${orderId}`, { headers: this.getHeaders() });
  }
}
