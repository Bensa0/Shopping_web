import { OrderItem } from './orderItem';
import { Product } from './product';
import { User } from './user';

export interface Order {
  orderId?: number;
  user: User;
  orderDate: number; // This could be a Date type in reality
  orderItem: OrderItem[];
}

