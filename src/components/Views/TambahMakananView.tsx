/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlusCircle, Image, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { MenuItem } from '../../types';

interface TambahMakananViewProps {
  onAddMenuItem: (item: MenuItem) => void;
  onSuccessRedirect: () => void;
}

// Curated beautiful gourmet food photo assets to make testing super fast and stunning
const PRESET_IMAGES = [
  { name: 'Nasi Goreng / Bakmi', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60' },
  { name: 'Ayam Goreng / Bebek', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60' },
  { name: 'Sate / Kebab Bakar', url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=500&auto=format&fit=crop&q=60' },
  { name: 'Gado-Gado / Salad Sayur', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60' },
  { name: 'Dessert / Buah Manis', url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60' },
  { name: 'Kopi / Teh Tarik', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' }
];

export function TambahMakananView({ onAddMenuItem, onSuccessRedirect }: TambahMakananViewProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Makanan' | 'Minuman' | 'Snack'>('Makanan');
  const [stock, setStock] = useState('30');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !description) {
      alert('Mohon isi semua field sebelum menyimpan produk!');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newItem: MenuItem = {
        id: `prod-${Math.floor(100 + Math.random() * 900)}`,
        name,
        price: parseFloat(price) || 0,
        category,
        stock: parseInt(stock) || 10,
        sales: 0,
        image: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=65',
        description
      };

      onAddMenuItem(newItem);
      setIsSubmitting(false);
      onSuccessRedirect();
    }, 600); // realistic short delay for smooth animation
  };

  const handleSelectPreset = (url: string) => {
    setImageUrl(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tambah Data Produk</h1>
        <p className="text-xs text-slate-400 mt-1">Form pendaftaran hidangan kuliner baru untuk dimasukkan ke katalog.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 md:p-8 shadow-xl dark:bg-slate-900"
        id="add-makanan-form-card"
      >
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          
          {/* Menu Name */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Nama Hidangan / Kuliner</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Contoh: Rendang Sapi Kampung bumbu Padang asli"
              className="w-full px-4 py-3 bg-slate-50/55 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
              id="new-food-name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Price */}
            <div className="sm:col-span-1">
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Harga Porsi (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="28000"
                min="1"
                className="w-full px-4 py-3 bg-slate-50/55 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-mono text-slate-900 dark:text-white"
                id="new-food-price"
              />
            </div>

            {/* Category selection */}
            <div className="sm:col-span-1">
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Kategori Hidangan</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 bg-slate-50/55 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                id="new-food-category"
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Snack font-semibold">Camilan / Snack</option>
              </select>
            </div>

            {/* In-stock porsi */}
            <div className="sm:col-span-1">
              <label className="block text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Stok Awal Porsi</label>
              <input
                type="number"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="25"
                min="0"
                className="w-full px-4 py-3 bg-slate-50/55 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none font-mono text-slate-900 dark:text-white"
                id="new-food-stock"
              />
            </div>
          </div>

          {/* Image Presets Selector to make design visual */}
          <div className="space-y-2">
            <label className="block text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide text-[10px]">
              Ilustrasi Foto Hidangan (Pilih preset estetik atau masukkan URL luar)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {PRESET_IMAGES.map(img => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => handleSelectPreset(img.url)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    imageUrl === img.url ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  title={img.name}
                >
                  <img src={img.url} alt={img.name} className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] text-white text-center truncate">
                    {img.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom URL Field */}
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 bg-slate-50 dark:bg-slate-950 border border-r-0 border-slate-150 dark:border-slate-850 rounded-l-xl text-slate-400">
                <Image className="h-4 w-4" />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Masukkan URL Link foto hidangan di internet..."
                className="flex-1 px-4 py-3 border border-l-0 border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-r-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Deskripsi Cita Rasa & Komposisi</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Jelaskan citarasa khas hidangan ini, misalnya: paduan rempah lada hitam yang hangat, disajikan bersanding nasi rempah..."
              className="w-full px-4 py-3 bg-slate-50/55 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white leading-relaxed font-normal"
              id="new-food-description"
            />
          </div>

          {/* Action row buttons */}
          <div className="flex gap-4 pt-4 border-t border-slate-50 dark:border-slate-850 lg:-mx-2">
            <button
              type="button"
              onClick={onSuccessRedirect}
              disabled={isSubmitting}
              className="flex-1 py-3 text-slate-600 border border-slate-150 rounded-xl hover:bg-slate-50 transition font-semibold"
            >
              Batal & Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-xl shadow-lg shadow-emerald-100 dark:shadow-none transition font-semibold flex items-center justify-center gap-1.5"
              id="save-new-food-item"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Mengunggah Menu...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4.5 w-4.5" />
                  Simpan ke Menu Makanan
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
