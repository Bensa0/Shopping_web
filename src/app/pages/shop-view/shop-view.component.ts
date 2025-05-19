import { Component, OnInit, Pipe } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../Interfaces/product';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { User } from 'src/app/Interfaces/user';
import { Order } from 'src/app/Interfaces/order';
import { OrderItem } from 'src/app/Interfaces/orderItem';
import { ProductService } from 'src/app/services/product.service';
import {
  BehaviorSubject,
  Observable,
  forkJoin,
  map,
  of,
  take,
  tap,
} from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { UserServiceService } from 'src/app/services/user-service.service';
import { FilterPipe } from 'src/app/components/pipe/filter.pipe';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SearchFormComponent } from 'src/app/components/search-form/search-form.component';

@Component({
  selector: 'xs-shop-view',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, SearchFormComponent],
  templateUrl: './shop-view.component.html',
  styleUrls: ['./shop-view.component.scss'],
})
export class ShopViewComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserServiceService
  ) {}
  categories: string[] = ['food', 'apparel', 'electronics', 'furniture'];
  searchText: string = '';
  shopRouteNavigationStatus: boolean | undefined;
  user!: User;
  products$: Observable<Product[]> = new BehaviorSubject<Product[]>([]);

  cart: Order = {
    user: this.user,
    orderDate: this.getCurrentYear(),
    orderItem: [],
  };
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const searchText = params['searchText'];
      console.log('Received Search Text:', searchText);
      // Now you can use this searchText for your filtering or other purposes
      this.searchText = searchText;
    });
    console.log('The Search Text', this.searchText);
    this.user = this.userService.getUser()!;

    // Fetch products
    this.productService.getAllProducts().subscribe((fetchedProducts) => {
      // this.products = fetchedProducts;
      this.products$ = of(fetchedProducts); //was of(this.products);
      this.initializeCart();
      this.initializeOrderItems();

      if (!this.user) {
        //alert('User not found : ' + this.user + '\nyou will be Treated as a Guest!');
        console.log(
          'User not found : ' + this.user + '\nyou will be Treated as a Guest!'
        );
      }
    });
  }
  initializeCart(): void {
    this.cart = {
      user: this.user,
      orderDate: this.getCurrentYear(),
      orderItem: [],
    };
    console.log(this.cart);
  }
  initializeOrderItems(): void {
    this.products$.pipe(take(1)).subscribe((products) => {
      this.cart.orderItem = products.map((product) => ({
        orderItemId: 0,
        product: product,
        quantity: 0,
        order: this.cart,
        fullPrice: product.price,
      }));
    });
  }
  addToCart(product: Product): void {
    this.products$.pipe(take(1)).subscribe((products) => {
      const existingItem = this.cart.orderItem.find(
        (item) => item.product.productId === product.productId
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        const newItem: OrderItem = {
          orderItemId: 0,
          product,
          quantity: 1,
          order: this.cart,
          fullPrice: product.price,
        };
        this.cart.orderItem.push(newItem);
      }

      this.changeTotal();
    });
  }
  removeProduct(index: number): void {
    this.products$.pipe(take(1)).subscribe((products) => {
      if (index >= 0 && index < products.length) {
        const productIdToRemove = products[index].productId;

        this.productService.deleteProduct(productIdToRemove).subscribe(() => {
          // Update the products$ observable by filtering out the removed product
          this.products$ = this.products$.pipe(
            map((products) =>
              products.filter(
                (product) => product.productId !== productIdToRemove
              )
            )
          );

          // Update the cart order items accordingly
          this.cart.orderItem = this.cart.orderItem.filter(
            (item) => item.product.productId !== productIdToRemove
          );

          // Update the UI as needed
          this.changeTotal();
        });
      }
    });
  }
  changeVal(orderItem: OrderItem): void {
    const eq =
      Math.round(orderItem.product.price * orderItem.quantity * 100) / 100;
    orderItem.fullPrice = eq;
    this.changeTotal();
  }
  changeTotal(): void {
    let price = 0;
    if (this.cart.orderItem) {
      this.cart.orderItem.forEach((orderItem) => {
        if (orderItem.quantity > 0 && typeof orderItem.fullPrice === 'number') {
          price += orderItem.fullPrice * orderItem.quantity;
        }
      });
    }
  }
  calculateSubtotal(): number {
    if (this.cart.orderItem) {
      return this.cart.orderItem.reduce((acc, orderItem) => {
        if (orderItem.fullPrice !== undefined && orderItem.quantity > 0) {
          return acc + orderItem.fullPrice * orderItem.quantity;
        }
        return acc;
      }, 0);
    }
    return 0;
  }
  clearCart(): void {
    this.cart.orderItem = [];
    this.changeTotal();
    // Optionally show a message that the cart is cleared
  }
  decrementQuantity(orderItem: OrderItem): void {
    if (orderItem.quantity > 0) {
      orderItem.quantity--;
      this.changeVal(orderItem);
    }
  }
  incrementQuantity(orderItem: OrderItem): void {
    orderItem.quantity++;
    this.changeVal(orderItem);
  }
  navigateToShop(): void {
    // First, create a new object based on this.cart to avoid modifying the original cart object
    const filteredCart = {
      ...this.cart,
      // Filter the orderItem to include only items where quantity > 0
      orderItem: this.cart.orderItem.filter((item) => item.quantity > 0),
    };

    const navigationExtras: NavigationExtras = {
      state: { cart: filteredCart }, // Here, pass the filtered cart in the state object
    };
    console.log(filteredCart);
    this.router.navigate(['/shop'], navigationExtras).then((success) => {
      this.shopRouteNavigationStatus = success;
    });
  }
  getCurrentYear(): number {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }
  applyFilter(filterType: string) {
    this.searchText = filterType;
  }

  clearFilter() {
    this.searchText = '';
  }
  handleSearchTextChange(searchText: string) {
    this.searchText = searchText;
  }
}
