/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Employee {
  id: string;
  name: string;
  role: 'Manager' | 'Kasir' | 'Koki' | 'Pelayan';
  email: string;
  phone: string;
  salary: number;
  status: 'Aktif' | 'Cuti' | 'Nonaktif';
  joinDate: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Makanan' | 'Minuman' | 'Snack';
  stock: number;
  sales: number; // total units sold
  image: string; // fallback illustration placeholder or gradient
  description: string;
}

export interface Transaction {
  id: string;
  date: string;
  customerName: string;
  items: {
    menuId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit';
  cashierName: string;
}

export interface DeveloperProfile {
  name: string;
  role: string;
  github: string;
  email: string;
  avatar: string;
  biodata: string;
  skills: string[];
}
