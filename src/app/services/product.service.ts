import { Injectable } from '@angular/core';
import { Product } from '../Interfaces/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiServerUrl = 'http://localhost:8080';
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<
    Product[]
  >([]);

  public get products$(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  constructor(private http: HttpClient) {}

  // private getHeaders(): HttpHeaders {
  //   const token = localStorage.getItem('token');
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }
  private getHeaders(): any {
    return '';
  }

  createProduct(product: Product): Observable<Product> {
    return this.http
    .post<Product>(`${this.apiServerUrl}/product/create`, product, {
      headers: this.getHeaders(),
    })
    .pipe(
      tap((createdProduct: Product) => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = [...currentProducts, createdProduct];
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiServerUrl}/product/all`, {
      headers: this.getHeaders(),
    });
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiServerUrl}/product/${productId}`);
  }

  updateProduct(productId: number, product: Product): Observable<Product> {
    return this.http
    .put<Product>(`${this.apiServerUrl}/product/${productId}`, product, {
      headers: this.getHeaders(),
    })
    .pipe(
      tap(() => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = currentProducts.map((p: Product) => {
          if (p.productId === productId) {
            return { ...p, ...product };
          }
          return p;
        });
        this.productsSubject.next(updatedProducts);
      })
    );
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http
    .delete<void>(`${this.apiServerUrl}/product/${productId}`, {
      headers: this.getHeaders(),
    })
    .pipe(
      tap(() => {
        const currentProducts = this.productsSubject.getValue();
        const updatedProducts = currentProducts.filter(
          (p: Product) => p.productId !== productId
        );
        this.productsSubject.next(updatedProducts);
      })
    );
  }
}
