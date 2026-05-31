/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, DollarSign, Package, ShoppingCart, ArrowUpRight, AlertCircle, Sparkles } from 'lucide-react';
import { MenuItem, Transaction } from '../../types';

interface BerandaViewProps {
  menuItems: MenuItem[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
}

export function BerandaView({ menuItems, transactions, onNavigate }: BerandaViewProps) {
  // Calculate analytics
  const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalItemsSold = menuItems.reduce((acc, item) => acc + item.sales, 0);
  const lowStockItems = menuItems.filter(item => item.stock <= 15);
  
  // Sales summary per product
  const sortedBySales = [...menuItems].sort((a, b) => b.sales - a.sales);
  const topProduct = sortedBySales[0];

  // Formatting currency
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Find max sales to scale our custom SVG bar chart
  const maxSales = Math.max(...menuItems.map(item => item.sales), 1);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 text-white shadow-xl"
        id="welcome-banner"
      >
        <div className="absolute top-0 right-0 -mr-12 -mt-12 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> E-Resto Pintar v1.0
            </span>
            <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">Selamat Datang di Beranda, Kasir!</h1>
            <p className="mt-1 text-sm text-slate-300">
              Berikut adalah tinjauan ringkasan penjualan, analitik produk terlaris, dan performa keuangan outlet hari ini.
            </p>
          </div>
          <button
            onClick={() => onNavigate('penjualan')}
            className="self-start md:self-auto inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-all duration-200 hover:bg-slate-100 hover:shadow-lg active:scale-95"
            id="quick-order-btn"
          >
            Buat Transaksi Baru
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Pendapatan',
            value: formatRupiah(totalRevenue),
            desc: 'Akumulasi penjualan berdasar riwayat',
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
            border: 'border-emerald-100 dark:border-emerald-950/50'
          },
          {
            title: 'Total Menu Terjual',
            value: `${totalItemsSold} Porsi`,
            desc: 'Unit terdistribusi ke pelanggan',
            icon: ShoppingCart,
            color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
            border: 'border-amber-100 dark:border-amber-950/50'
          },
          {
            title: 'Menu Terlaris',
            value: topProduct ? topProduct.name : '-',
            desc: `${topProduct ? topProduct.sales : 0} porsi terorder semenjak rilis`,
            icon: TrendingUp,
            color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400',
            border: 'border-indigo-100 dark:border-indigo-950/50'
          },
          {
            title: 'Stok Sisa Sedikit',
            value: `${lowStockItems.length} Produk`,
            desc: 'Stok kurang dari 15, perlu diisi',
            icon: Package,
            color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400',
            border: 'border-rose-100 dark:border-rose-950/50'
          }
        ].map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 + 0.1, duration: 0.4 }}
              className={`rounded-2xl border ${kpi.border} bg-white p-5 shadow-sm dark:bg-slate-900 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <span className={`rounded-xl p-2.5 ${kpi.color}`}>
                  <IconComponent className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-xl font-bold text-slate-900 dark:text-white block truncate">
                  {kpi.value}
                </span>
                <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
                  {kpi.desc}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Bar Chart and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ringkasan Penjualan Per Produk Bar Chart Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900 flex flex-col justify-between"
          id="sales-chart-card"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Analitik Penjualan per Produk</h2>
                <p className="text-xs text-slate-400 mt-1">Perbandingan jumlah porsi terjual antar menu</p>
              </div>
              <span className="text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg">
                Statistik Live
              </span>
            </div>

            {/* Premium, Interactive Pure CSS/SVG Bar Chart */}
            <div className="space-y-4">
              {menuItems.map((item, idx) => {
                const percentage = Math.round((item.sales / maxSales) * 100);
                return (
                  <div key={item.id} className="group">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white font-semibold">
                        {item.sales} Porsi <span className="text-slate-400 font-normal">({formatRupiah(item.price * item.sales)})</span>
                      </span>
                    </div>

                    <div className="relative h-7 w-full overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100/50 dark:border-slate-850">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 + 0.3, ease: 'easeOut' }}
                        className={`h-full flex items-center justify-end pr-2.5 bg-gradient-to-r ${
                          item.category === 'Makanan'
                            ? 'from-indigo-500/85 to-indigo-600'
                            : item.category === 'Minuman'
                            ? 'from-emerald-400/85 to-emerald-500'
                            : 'from-amber-400/85 to-amber-500'
                        }`}
                      >
                        {percentage > 10 && (
                          <span className="text-[9px] font-bold text-white tracking-widest uppercase">
                            {percentage}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-50 dark:border-slate-850/50 mt-6 pt-4 flex justify-between items-center text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-500" /> Makanan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Minuman
            </span>
            <span>Total: {menuItems.length} varian menu aktif</span>
          </div>
        </motion.div>

        {/* Alerts & Stock Monitor Card */}
        <div className="space-y-4">
          {/* Low Stock Watch */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-5 shadow-sm dark:bg-slate-900"
            id="low-stock-monitor"
          >
            <h2 className="text-md font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-rose-500" />
              Pantauan Restok Bahan
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Daftar menu dengan batas sisa porsi kritis (segera habis).
            </p>

            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1.5 scrollbar-thin">
              {lowStockItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-100 dark:border-slate-850 rounded-xl">
                  Semua stok menu aman & penuh!
                </div>
              ) : (
                lowStockItems.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center rounded-xl p-3 border border-rose-50/50 dark:border-rose-950/20 bg-rose-50/30 dark:bg-rose-950/10"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.category}</p>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 px-2 py-1 rounded-lg">
                      Sisa: {item.stock} porsi
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Quick Stats Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5"
          >
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Info Aktivitas Outlet</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Transaksi Hari Ini</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{transactions.length} checkout</span>
              </div>
              <hr className="border-slate-200/50 dark:border-slate-850/50" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Metode Favorit</span>
                <span className="font-semibold text-slate-900 dark:text-white bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 rounded text-[10px] text-indigo-600 dark:text-indigo-400">
                  QRIS (Cashless)
                </span>
              </div>
              <hr className="border-slate-200/50 dark:border-slate-850/50" />
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Rata-rata Keranjang</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {formatRupiah(totalRevenue / (transactions.length || 1))}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
