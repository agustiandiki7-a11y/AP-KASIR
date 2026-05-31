/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, Trash2, CreditCard, DollarSign, QrCode, Tag, Sparkles, ReceiptText, ChevronDown, Check, RefreshCw } from 'lucide-react';
import { MenuItem, Transaction } from '../../types';

interface PenjualanViewProps {
  transactions: Transaction[];
  menuItems: MenuItem[];
  cart: { item: MenuItem; quantity: number }[];
  onRemoveFromCart: (menuId: string) => void;
  onClearCart: () => void;
  onCheckout: (customerName: string, paymentMethod: 'Tunai' | 'QRIS' | 'Debit', cashierName: string) => void;
}

export function PenjualanView({
  transactions,
  menuItems,
  cart,
  onRemoveFromCart,
  onClearCart,
  onCheckout
}: PenjualanViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit'>('QRIS');
  const [cashierName, setCashierName] = useState('Dewi Lestari');
  
  // Calculate checkout metrics
  const checkoutSubtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const tax = Math.round(checkoutSubtotal * 0.1); // 10% PPN
  const totalDue = checkoutSubtotal + tax;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const getMethodBadge = (m: string) => {
    switch (m) {
      case 'QRIS': return 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Debit': return 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';
      default: return 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400';
    }
  };

  // Searching transactions
  const filteredTransactions = transactions.filter(t => {
    return t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           t.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSimulateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Keranjang belanja kasir kosong! Pilih beberapa menu terlebih dahulu.');
      return;
    }
    if (!customerName) {
      alert('Harap isi Nama Pelanggan!');
      return;
    }

    onCheckout(customerName, paymentMethod, cashierName);
    
    // reset draft fields
    setCustomerName('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Historical List block (Colpan 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Riwayat Penjualan</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar transaksi kasir, struk pembayaran, dan pemantauan kas harian.</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari struk transaksi berdasarkan Nama, Kode ID, atau Metode..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium shadow-sm"
            id="transaction-search-input"
          />
        </div>

        {/* Transactions list */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                layoutId={`tx-${tx.id}`}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-5 shadow-sm dark:bg-slate-900 flex flex-col justify-between hover:border-slate-200 transition-colors"
                id={`receipt-card-${tx.id}`}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-50 dark:border-slate-850 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-indigo-500" />
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{tx.id}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded">
                      {new Date(tx.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                  <span className={`self-start sm:self-auto text-[9px] font-bold uppercase tracking-wider rounded px-2.5 py-1 ${getMethodBadge(tx.paymentMethod)}`}>
                    {tx.paymentMethod}
                  </span>
                </div>

                {/* Items detail list */}
                <div className="py-4 space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {tx.items.map(item => (
                    <div key={item.menuId} className="flex justify-between items-center bg-slate-50/45 dark:bg-slate-950/20 p-2 rounded-xl">
                      <span>{item.name} <span className="text-slate-400 font-normal">x{item.quantity}</span></span>
                      <span className="font-mono text-slate-900 dark:text-white">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-50 dark:border-slate-850/50 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="text-[11px] text-slate-400">
                    Kasir: <span className="font-semibold text-slate-600 dark:text-slate-300">{tx.cashierName}</span> • Pelanggan: <span className="font-semibold text-slate-600 dark:text-slate-300">{tx.customerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mr-1 select-none">Total Bayar:</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{formatRupiah(tx.totalAmount)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800">
              <span className="text-sm text-slate-400">Belum ada struk penjualan yang terdaftar sesuai penyaringan.</span>
            </div>
          )}
        </div>
      </div>

      {/* POS Checkout Side-Drawer Panel */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-5 shadow-xl dark:bg-slate-900 sticky top-6 flex flex-col h-[calc(100vh-140px)] justify-between"
          id="pos-cashier-drawer"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-3 mb-4">
              <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShoppingCart className="h-4.5 w-4.5 text-indigo-500" />
                Daftar Draft Kasir
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-[10px] text-rose-500 hover:underline font-bold uppercase transition"
                  id="checkout-clear-all"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Selected drafted items scroll list */}
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-150 dark:border-slate-850 rounded-xl">
                  Keranjang kosong. Ambil menu di tab "Menu Makanan" untuk diproses ke kasir!
                </div>
              ) : (
                cart.map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center rounded-xl p-3 border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20"
                    id={`cart-item-${item.id}`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{formatRupiah(item.price)} x {quantity}</p>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      id={`remove-draft-cart-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* POS Bill settings Form */}
          <form onSubmit={handleSimulateCheckout} className="space-y-4 border-t border-slate-50 dark:border-slate-850 pt-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Pilih Staf Kasir Penjaga</label>
              <select
                value={cashierName}
                onChange={e => setCashierName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                id="pos-form-cashier"
              >
                <option value="Agus Setiawan">Agus Setiawan (Manager)</option>
                <option value="Dewi Lestari">Dewi Lestari (Kasir Utama)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Nama Customer / Pelanggan</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Contoh: Ibu Ani / Meja 12"
                className="w-full px-3.5 py-2.5 bg-slate-50/80 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                id="pos-form-customer"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'QRIS', label: 'QRIS', icon: QrCode },
                  { id: 'Tunai', label: 'Tunai', icon: DollarSign },
                  { id: 'Debit', label: 'Debit', icon: CreditCard }
                ].map(method => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`py-2 px-1 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] ${
                        paymentMethod === method.id
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                          : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-600 dark:bg-slate-950 dark:text-slate-350'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {method.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculations summaries */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl space-y-1.5 border border-slate-100/50 dark:border-slate-850">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">Subtotal Belanja</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">{formatRupiah(checkoutSubtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">PPN Perusahaan (10%)</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">{formatRupiah(tax)}</span>
              </div>
              <hr className="border-slate-200/50 dark:border-slate-850/50 my-1" />
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Wajib Bayar</span>
                <span className="font-extrabold text-[#10B981] dark:text-emerald-400 font-mono text-[13px]">{formatRupiah(totalDue)}</span>
              </div>
            </div>

            {/* Checkout Trigger */}
            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none transition flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider"
              id="simulate-checkout-btn"
            >
              Selesaikan Transaksi Kasir
            </button>
          </form>
        </motion.div>
      </div>

    </div>
  );
}
