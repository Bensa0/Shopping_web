import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { OrderItem } from '../Interfaces/orderItem';
import { OrderItemDTO } from '../InterfacesDTO/OrderItemDTO';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private apiServerUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createOrderItem(orderItemDTO: OrderItemDTO): Observable<OrderItem> {
    return this.http.post<OrderItem>(
      `${this.apiServerUrl}/orderItem/create`,
      orderItemDTO,
      { headers: this.getHeaders() } // Add the token to headers
    );
  }

  getAllOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiServerUrl}/orderItem/all`, {
      headers: this.getHeaders(),
    });
  }

  getOrderItemsByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.apiServerUrl}/orderItem/by-order/${orderId}`,
      { headers: this.getHeaders() }
    );
  }

  getOrderItemsByProductId(productId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.apiServerUrl}/orderItem/by-product/${productId}`,
      { headers: this.getHeaders() }
    );
  }

  updateOrderItem(
    orderItemId: number,
    orderItem: OrderItem
  ): Observable<OrderItem> {
    return this.http.put<OrderItem>(
      `${this.apiServerUrl}/orderItem/${orderItemId}`,
      orderItem,
      { headers: this.getHeaders() } // Add the token to headers
    );
  }

  deleteOrderItem(orderItemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiServerUrl}/orderItem/${orderItemId}`,
      { headers: this.getHeaders() } // Add the token to headers
    );
  }
}
