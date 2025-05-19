import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { ShopViewComponent } from '../shop-view/shop-view.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/Interfaces/order';
import { Product } from 'src/app/Interfaces/product';
import { OrderItem } from 'src/app/Interfaces/orderItem';
import { OrderItemService } from 'src/app/services/order-item.service';
import { OrderService } from 'src/app/services/order.service';
import { OrderItemDTO } from 'src/app/InterfacesDTO/OrderItemDTO';
import { OrderCreateDTO } from 'src/app/InterfacesDTO/OrderDTO';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'xs-shop',
  standalone: true,
  imports: [CommonModule, MatCardModule, FormsModule, ShopViewComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  cart: Order | undefined; // Declare the cart variable

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cart = history.state.cart as Order; // Get the cart from the state object
    console.log(this.cart); // Check if the cart data is received correctly
    if (this.cart) this.inventory = this.cart.orderItem;
  }

  selection: OrderItem[] = [];

  // products!: Product[];
  //  = [
  //   {
  //     productId: 1,
  //     name: 'Milk',
  //     price: 2.65,
  //     orders: [],
  //     description: 'desc' /* other properties */,
  //   },
  //   {
  //     productId: 2,
  //     name: 'Bread',
  //     price: 2.15,
  //     orders: [],
  //     description: 'desc' /* other properties */,
  //   },
  //   // ... rest of your product items
  // ];

  inventory: OrderItem[] = [];

  getInventoryTotal(): number {
    return this.inventory.reduce((total, item) => total + item.fullPrice!, 0);
  }

  // remove(item: Product): void {
  //   console.log('Removing item:', item);
  //   const index = this.products.indexOf(item);
  //   console.log('Item index:', index);
  //   this.products.splice(index, 1);
  // }

  removeInventory(item: OrderItem): void {
    const index = this.inventory.indexOf(item);

    if (index !== -1) {
      // Remove the item from the inventory
      this.inventory.splice(index, 1);

      // // Add the item back to the shopping list
      // this.products.push(item.product);
    }
  }

  clearAll(products: OrderItem[] | Product[]): void {
    products.splice(0, products.length);
  }

  // sortedProducts(): Product[] {
  //   return this.products.slice().sort((a, b) => {
  //     if (a.checked !== b.checked) {
  //       return a.checked ? 1 : -1;
  //     }
  //     return a.name.localeCompare(b.name);
  //   });
  // }
  clickedStates: { [itemId: string]: 'up' | 'down' } = {};

  toggleCaret(direction: 'up' | 'down', item: any): void {
    console.log('toggled', direction);
    this.clickedStates[item.id] = direction;
  }
  isUpIconBouncing = false;
  isDownIconBouncing = false;
  bounceUpIconOnce(item: OrderItem): void {
    item.quantity++;
    this.isUpIconBouncing = true;
    setTimeout(() => {
      this.isUpIconBouncing = false;
    }, 1000); // Adjust the duration as needed (in milliseconds)
  }

  bounceDownIconOnce(item: OrderItem): void {
    if (item.quantity != 0) {
      item.quantity--;
    } else {
      console.log('quantity = 0');
    }

    console.log('bounceDown', item);
    this.isDownIconBouncing = true;
    setTimeout(() => {
      this.isDownIconBouncing = false;
    }, 1000); // Adjust the duration as needed (in milliseconds)
  }

  saveInventory(inventory: OrderItem[]): void {
    if (!this.cart) {
      alert('Inventort is Emtpy');
      return;
    }
    if (!this.cart!.user || !this.authService.loggedInUser) {
      alert('Please Sign in,user is undefined or token is empty');
      this.router.navigate(['/sign-in']);
      return;
    }

    const orderDTO: OrderCreateDTO = {
      user: this.cart!.user,
      orderDate: new Date().getFullYear(),
    };

    this.orderService.createOrder(orderDTO).subscribe(
      (createdOrder: Order) => {
        console.log('Order created:', createdOrder);

        // Iterate through the inventory and create order items
        inventory.forEach((item: OrderItem) => {
          const orderItemDTO: OrderItemDTO = {
            orderId: this.cart!.orderId!,
            productId: item.product.productId,
            quantity: item.quantity,
          };
          console.log(orderItemDTO);

          this.orderItemService.createOrderItem(orderItemDTO).subscribe(
            (createdOrderItem: OrderItem) => {
              console.log('Order item created:', createdOrderItem);
            },
            (error: any) => {
              console.error('Error creating order item:', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error creating order:', error);
      }
    );
  }
}
