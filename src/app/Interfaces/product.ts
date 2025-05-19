import { Order } from './order';

export interface Product {
  productId: number;
  name: string;
  description?: string;
  category: string;
  price: number;
  orders?: Order[];
  checked?: boolean;
}
