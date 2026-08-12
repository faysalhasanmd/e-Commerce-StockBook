export type UserRole = "CUSTOMER" | "ADMIN" | "MANAGER";
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  stock: number;
  image?: string | null;
  categoryId: string;
  category?: Category;
  isDeleted: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
  userId: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
