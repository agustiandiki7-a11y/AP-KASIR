/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Plus, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';
import { MenuItem } from '../../types';

interface MakananViewProps {
  menuItems: MenuItem[];
  onOpenAddMakanan: () => void;
  onAddToCart?: (item: MenuItem) => void;
  cartCountById?: Record<string, number>;
}

export function MakananView({
  menuItems,
  onOpenAddMakanan,
  onAddToCart,
  cartCountById = {}
}: MakananViewProps) {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Makanan' | 'Minuman' | 'Snack'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'Semua') {
      return matchesSearch;
    }
    return matchesSearch && item.category === activeTab;
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Upper header action banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Katalog Hidangan & Menu</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar hidangan aktif, persediaan porsi, manajemen harga, dan kategori.</p>
        </div>
        <button
          onClick={onOpenAddMakanan}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition"
          id="action-navigate-to-add-food"
        >
          <Plus className="h-4.5 w-4.5" /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari makanan, minuman segar, atau deskripsi rasa..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            id="food-search-box"
          />
        </div>

        <div className="flex bg-slate-50 dark:bg-slate-950/50 p-1 rounded-xl border border-slate-100 dark:border-slate-850">
          {(['Semua', 'Makanan', 'Minuman', 'Snack'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMenuItems.map((item, idx) => {
            const inCartCount = cartCountById[item.id] || 0;
            const isLowStock = item.stock <= 15 && item.stock > 0;
            const isOutOfStock = item.stock === 0;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white shadow-sm dark:bg-slate-900"
                id={`food-card-${item.id}`}
              >
                {/* Food Image with overlay tags */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
                  {/* Category Stamp */}
                  <span className={`absolute top-3 left-3 z-10 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                    item.category === 'Makanan'
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : item.category === 'Minuman'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {item.category}
                  </span>

                  {/* Stock Level Warning */}
                  {isOutOfStock ? (
                    <span className="absolute top-3 right-3 z-10 rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md animate-pulse">
                      Stok Habis
                    </span>
                  ) : isLowStock ? (
                    <span className="absolute top-3 right-3 z-10 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                      Sisa {item.stock} porsi
                    </span>
                  ) : null}

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback stylized abstract graphic if images are blocked or unloaded
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=65';
                    }}
                  />
                  
                  {/* Premium shading overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  
                  {/* Live Units count in corner overlay */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-sm px-2 py-0.5 rounded-md font-mono">
                    {item.sales} Terjual
                  </span>
                </div>

                {/* Info and ingredients */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {item.name}
                      </h4>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed text-justify line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-50 dark:border-slate-850/50 pt-4 flex items-center justify-between">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">HARGA PER PORTI</span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{formatRupiah(item.price)}</span>
                    </div>

                    {onAddToCart && (
                      <button
                        onClick={() => !isOutOfStock && onAddToCart(item)}
                        disabled={isOutOfStock}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.8 text-xs font-semibold transition ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-850'
                            : inCartCount > 0
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-50 dark:shadow-none'
                        }`}
                        id={`add-to-cart-btn-${item.id}`}
                      >
                        {inCartCount > 0 ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Draft ({inCartCount})
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Ambil
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredMenuItems.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
          <p className="text-sm text-slate-400">Tidak ada produk makanan yang cocok dengan penyaringan Anda.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('Semua'); }}
            className="mt-3 text-xs font-semibold text-emerald-600 hover:underline"
          >
            Bersihkan Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
