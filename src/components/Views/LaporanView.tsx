/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileBarChart, Calendar, TrendingUp, Info, ArrowUpRight, Award, Flame, Sparkles } from 'lucide-react';
import { MenuItem, Transaction } from '../../types';

interface LaporanViewProps {
  transactions: Transaction[];
  menuItems: MenuItem[];
}

export function LaporanView({ transactions, menuItems }: LaporanViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Bulanan');
  const [selectedMonth, setSelectedMonth] = useState('Mei 2026');

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Calculations
  const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalOrders = transactions.length;
  const avgOrderVal = totalRevenue / (totalOrders || 1);

  // Category breakdown
  let foodRevenue = 0;
  let drinkRevenue = 0;
  transactions.forEach(t => {
    t.items.forEach(item => {
      const match = menuItems.find(m => m.id === item.menuId);
      if (match) {
        if (match.category === 'Makanan') {
          foodRevenue += item.price * item.quantity;
        } else if (match.category === 'Minuman') {
          drinkRevenue += item.price * item.quantity;
        }
      }
    });
  });

  // Hot food recommendation based on unit sales
  const sortedItems = [...menuItems].sort((a, b) => b.sales - a.sales);
  const coreHotItem = sortedItems[0];
  const secondHotItem = sortedItems[1];

  // Periodic simulated timeline (Harian) to make a line/area chart representation
  const graphData = [
    { label: 'Sen', amount: 320000 },
    { label: 'Sel', amount: 280000 },
    { label: 'Rab', amount: 410000 },
    { label: 'Kam', amount: 390000 },
    { label: 'Jum', amount: 560000 },
    { label: 'Sab', amount: 720000 },
    { label: 'Min', amount: 640000 }
  ];

  const maxGraphVal = Math.max(...graphData.map(g => g.amount), 1);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pelaporan Secara Periodik</h1>
          <p className="text-xs text-slate-400 mt-1">Laporan rekap omzet, performa per kategori, pembagian pajak, dan data porsi.</p>
        </div>

        {/* Period controller */}
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-100 dark:border-slate-850 self-start sm:self-auto font-semibold">
          {(['Harian', 'Mingguan', 'Bulanan'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs transition ${
                selectedPeriod === p
                  ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                  : 'text-slate-550 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Laporan {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly Revenue line peak chart (SVG) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 rounded-2xl border border-slate-150/60 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900"
          id="periodic-chart-report"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileBarChart className="h-4 w-4 text-emerald-500" />
                Tren Arus Kas (Pendapatan Senggang Mingguan)
              </h3>
              <p className="text-[10px] text-slate-405 dark:text-slate-400 mt-0.5">Peninjauan perolehan kotor 7 hari terakhir</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-100/50 dark:border-slate-850">
              Periode: {selectedMonth}
            </span>
          </div>

          {/* Premium interactive chart representation with SVG peaks */}
          <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 relative border-b border-l border-slate-100/70 dark:border-slate-850 pl-2 pb-2">
            
            {/* Absolute indicator grids */}
            <div className="absolute inset-x-0 top-6 border-t border-dashed border-slate-50 dark:border-slate-900 flex justify-between text-[8px] text-slate-300 font-mono select-none pointer-events-none">
              <span>TINGGI ({formatRupiah(Math.round(maxGraphVal))})</span>
            </div>
            
            {graphData.map((d, index) => {
              const barHeight = (d.amount / maxGraphVal) * 85; // cap at 85% safety
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center group">
                  
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-36 bg-slate-900 text-white rounded px-2 py-0.5 text-[9px] font-mono shadow transition-opacity">
                    {formatRupiah(d.amount)}
                  </div>

                  {/* Gradient Area/Bar indicator */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ delay: index * 0.05 + 0.2, type: 'spring', stiffness: 80 }}
                    className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-600 dark:from-indigo-600/70 dark:to-indigo-500 shadow-md transition-all group-hover:brightness-110"
                  />
                  
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 mt-2 font-mono">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-405 leading-relaxed">
            <Info className="h-4 w-4 text-slate-400" />
            <span>Puncak omzet dicapai pada akhir pekan (Sabtu-Minggu) dengan kenaikan sekitar 40%.</span>
          </div>
        </motion.div>

        {/* Performansi Kategori & Best Seller */}
        <div className="space-y-4">
          
          {/* Menu Kategori Pie-alike comparative bars */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-5 shadow-sm dark:bg-slate-905"
            id="category-stats-report"
          >
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Omzet per Golongan</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-350 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-indigo-500" /> Makanan Berat
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    {formatRupiah(foodRevenue)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(foodRevenue / (totalRevenue || 1)) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600 dark:text-slate-350 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded bg-emerald-400" /> Minuman Segar
                  </span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    {formatRupiah(drinkRevenue)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(drinkRevenue / (totalRevenue || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hot Items details */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/20 dark:to-slate-900 p-5 shadow-sm"
          >
            <h3 className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5" /> Hidangan Terpopuler
            </h3>
            
            {coreHotItem && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-500 fill-orange-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{coreHotItem.name}</span>
                </div>
                <div className="text-[11px] text-slate-505 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Varian Produk:</span>
                    <span className="font-bold">{coreHotItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kuantitas Laku:</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{coreHotItem.sales} porsi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sumbangsih Kas:</span>
                    <span className="font-bold font-mono">{formatRupiah(coreHotItem.sales * coreHotItem.price)}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

      </div>

      {/* Finance Table summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white shadow-sm overflow-hidden dark:bg-slate-900"
        id="financial-table-card"
      >
        <div className="p-5 border-b border-slate-50 dark:border-slate-850">
          <h3 className="text-[13px] font-bold text-slate-900 dark:text-white uppercase tracking-wide">Ringkasan Tabel Laporan Keuangan</h3>
        </div>
        <div className="overflow-x-auto text-xs font-semibold text-slate-600 dark:text-slate-350">
          <table className="w-full">
            <thead className="bg-slate-50/70 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
              <tr>
                <th className="p-4 text-left font-bold uppercase tracking-wider text-[10px] text-slate-400">Parameter Keuangan</th>
                <th className="p-4 text-center font-bold uppercase tracking-wider text-[10px] text-slate-400">Volume Transaksi</th>
                <th className="p-4 text-right font-bold uppercase tracking-wider text-[10px] text-slate-400">Jumlah Akumulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50 dark:divide-slate-850/50">
              <tr>
                <td className="p-4 text-slate-900 dark:text-white font-bold">Pendapatan Kotor Kasir (Omzet)</td>
                <td className="p-4 text-center font-mono">{totalOrders} checkout</td>
                <td className="p-4 text-right font-mono font-bold text-slate-900 dark:text-white">{formatRupiah(totalRevenue)}</td>
              </tr>
              <tr>
                <td className="p-4">Rata-rata Pendapatan per Struk belanja</td>
                <td className="p-4 text-center font-mono">1 transaksi</td>
                <td className="p-4 text-right font-mono text-slate-700 dark:text-slate-300">{formatRupiah(Math.round(avgOrderVal))}</td>
              </tr>
              <tr>
                <td className="p-4">PPN 10% Terpungut Negara</td>
                <td className="p-4 text-center font-mono">{totalOrders} struk</td>
                <td className="p-4 text-right font-mono text-slate-700 dark:text-slate-300">{formatRupiah(Math.round(totalRevenue * 0.1))}</td>
              </tr>
              <tr>
                <td className="p-4 text-[#10B981] dark:text-emerald-400 font-bold">Perkiraan Laba Operasional Bersih (Estimasi 85%)</td>
                <td className="p-4 text-center font-mono">Mei 25</td>
                <td className="p-4 text-right font-mono font-bold text-[#10B981] dark:text-emerald-450">{formatRupiah(Math.round(totalRevenue * 0.85))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
