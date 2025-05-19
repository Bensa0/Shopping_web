import { Order } from './order';
import { Product } from './product';

export interface OrderItem {
  orderItemId?: number;
  product: Product;
  quantity: number;
  order: Order|null;
  fullPrice?: number;
  checked?: boolean;
}
