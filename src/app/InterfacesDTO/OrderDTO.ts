import { User } from "../Interfaces/user";

export interface OrderCreateDTO {
  user: User;
  orderDate: number; // You can change this to Date type if needed
}
