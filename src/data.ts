/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, MenuItem, Transaction, DeveloperProfile } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Nasi Goreng Kampung Spesial',
    price: 28000,
    category: 'Makanan',
    stock: 25,
    sales: 142,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60',
    description: 'Nasi goreng bumbu terasi khas Jawa dengan telur mata sapi, ayam suwir, acar segar, dan kerupuk udang renyah.'
  },
  {
    id: 'm2',
    name: 'Ayam Goreng Lengkuas Kremes',
    price: 32000,
    category: 'Makanan',
    stock: 18,
    sales: 98,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60',
    description: 'Ayam kampung ungkep bumbu kuning digoreng garing, ditaburi limpahan rempah parutan lengkuas kremes yang gurih harumi.'
  },
  {
    id: 'm3',
    name: 'Sate Ayam Madura Saus Kacang',
    price: 30000,
    category: 'Makanan',
    stock: 30,
    sales: 120,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=60',
    description: '10 tusuk sate daging ayam empuk dipanggang arang kayu asli, disajikan dengan saus kacang kental, irisan bawang merah, dan cabai.'
  },
  {
    id: 'm4',
    name: 'Gado-Gado Pengantin Batavia',
    price: 25000,
    category: 'Makanan',
    stock: 15,
    sales: 64,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
    description: 'Sayuran segar rebus bersaus kacang gurih manis-pedas sedang, ditambah potongan telur rebus, tahu panggang, tempe, kentang, dan emping.'
  },
  {
    id: 'm5',
    name: 'Es Teler Durian Mewah',
    price: 22000,
    category: 'Minuman',
    stock: 20,
    sales: 115,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60',
    description: 'Kombinasi kelapa muda, potongan alpukat mentega, nangka wangi, buah durian asli montong, sirup pandan, susu kental manis, dan es serut.'
  },
  {
    id: 'm6',
    name: 'Teh Tarik Pandan Wangi',
    price: 12000,
    category: 'Minuman',
    stock: 50,
    sales: 210,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60',
    description: 'Seduhan teh hitam pekat dipadukan susu evaporasi manis gurih, ditarik busa tebal wangi pandan alami.'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    name: 'Agus Setiawan',
    role: 'Manager',
    email: 'agus.setiawan@eresto.com',
    phone: '0812-3456-7890',
    salary: 6500000,
    status: 'Aktif',
    joinDate: '2024-02-15'
  },
  {
    id: 'emp-102',
    name: 'Dewi Lestari',
    role: 'Kasir',
    email: 'dewi.lestari@eresto.com',
    phone: '0821-9876-5432',
    salary: 4200000,
    status: 'Aktif',
    joinDate: '2024-05-10'
  },
  {
    id: 'emp-103',
    name: 'Koki Budi Santoso',
    role: 'Koki',
    email: 'budi.santoso@eresto.com',
    phone: '0857-4433-2211',
    salary: 5500000,
    status: 'Aktif',
    joinDate: '2023-11-01'
  },
  {
    id: 'emp-104',
    name: 'Feri Irawan',
    role: 'Pelayan',
    email: 'feri.irawan@eresto.com',
    phone: '0899-7766-5544',
    salary: 3500000,
    status: 'Aktif',
    joinDate: '2025-01-20'
  },
  {
    id: 'emp-105',
    name: 'Siti Rahma',
    role: 'Pelayan',
    email: 'siti.rahma@eresto.com',
    phone: '0878-1122-3344',
    salary: 3500000,
    status: 'Cuti',
    joinDate: '2024-08-12'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-9081',
    date: '2026-05-31T08:12:00Z',
    customerName: 'Dian Saputra',
    items: [
      { menuId: 'm1', name: 'Nasi Goreng Kampung Spesial', quantity: 2, price: 28000 },
      { menuId: 'm5', name: 'Es Teler Durian Mewah', quantity: 2, price: 22000 }
    ],
    totalAmount: 100000,
    paymentMethod: 'QRIS',
    cashierName: 'Dewi Lestari'
  },
  {
    id: 'TX-9082',
    date: '2026-05-31T10:15:00Z',
    customerName: 'Hendra Wijaya',
    items: [
      { menuId: 'm2', name: 'Ayam Goreng Lengkuas Kremes', quantity: 1, price: 32000 },
      { menuId: 'm6', name: 'Teh Tarik Pandan Wangi', quantity: 1, price: 12000 }
    ],
    totalAmount: 44000,
    paymentMethod: 'Tunai',
    cashierName: 'Dewi Lestari'
  },
  {
    id: 'TX-9083',
    date: '2026-05-31T11:45:00Z',
    customerName: 'Rina Marlina',
    items: [
      { menuId: 'm3', name: 'Sate Ayam Madura Saus Kacang', quantity: 2, price: 30000 },
      { menuId: 'm5', name: 'Es Teler Durian Mewah', quantity: 1, price: 22000 },
      { menuId: 'm6', name: 'Teh Tarik Pandan Wangi', quantity: 1, price: 12000 }
    ],
    totalAmount: 94000,
    paymentMethod: 'Debit',
    cashierName: 'Dewi Lestari'
  },
  {
    id: 'TX-9084',
    date: '2026-05-30T13:30:00Z',
    customerName: 'Kelompok 4 Kantor Pos',
    items: [
      { menuId: 'm1', name: 'Nasi Goreng Kampung Spesial', quantity: 4, price: 28000 },
      { menuId: 'm3', name: 'Sate Ayam Madura Saus Kacang', quantity: 2, price: 30000 },
      { menuId: 'm6', name: 'Teh Tarik Pandan Wangi', quantity: 6, price: 12000 }
    ],
    totalAmount: 244000,
    paymentMethod: 'QRIS',
    cashierName: 'Agus Setiawan'
  },
  {
    id: 'TX-9085',
    date: '2026-05-30T18:20:00Z',
    customerName: 'Citra Kirana',
    items: [
      { menuId: 'm4', name: 'Gado-Gado Pengantin Batavia', quantity: 2, price: 25000 },
      { menuId: 'm5', name: 'Es Teler Durian Mewah', quantity: 2, price: 22000 }
    ],
    totalAmount: 94000,
    paymentMethod: 'Tunai',
    cashierName: 'Dewi Lestari'
  }
];

export const DEVELOPER_PROFILE: DeveloperProfile = {
  name: 'Andiki Agustian',
  role: 'Full-Stack Software Craftsman',
  github: 'https://github.com/agustiandiki7',
  email: 'agustiandiki7@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60', // beautiful artistic man profile picture
  biodata: 'Seorang Software Engineer yang berfokus pada detail, menyukai kreasi visual bernilai seni tinggi, transisi animasi halus (fluent and micro-interactions), serta optimalisasi sistem. Mengutamakan kepuasan pengguna akhir melalui paduan desain estetis modern dan performa tinggi.',
  skills: [
    'React.js',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'Node.js & Express',
    'Postgres / Firestore',
    'UI/UX Design',
    'Data Visualization'
  ]
};
