/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Sale {
  orderNumber: string;
  product: string;
  price: number;
  date: string; // ISO format YYYY-MM-DD
  paymentMethod: string;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

export interface ProductSales {
  product: string;
  revenue: number;
  quantity: number;
}

export interface PaymentStats {
  method: string;
  count: number;
  revenue: number;
}
