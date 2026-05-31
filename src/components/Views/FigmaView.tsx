/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Palette, Type, Layout, ArrowRight, Layers, FileCode, Check, Copy, ExternalLink, Sliders, Smartphone, Laptop, Tablet 
} from 'lucide-react';

export function FigmaView() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [accentColor, setAccentColor] = useState<string>('#10b981'); // Emerald
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.4);

  // Dynamic user Figma URL management
  const [userFigmaUrl, setUserFigmaUrl] = useState<string>(() => {
    return localStorage.getItem('eresto_user_figma_url') || 'https://www.figma.com/community/file/1162464761448650392';
  });
  const [inputUrl, setInputUrl] = useState<string>(userFigmaUrl);
  const [isUrlEditing, setIsUrlEditing] = useState<boolean>(false);

  const handleSaveFigmaUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('eresto_user_figma_url', inputUrl);
    setUserFigmaUrl(inputUrl);
    setIsUrlEditing(false);
    setCopiedText('UrlSaved');
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleResetFigmaUrl = () => {
    const defaultUrl = 'https://www.figma.com/community/file/1162464761448650392';
    setInputUrl(defaultUrl);
    setUserFigmaUrl(defaultUrl);
    localStorage.setItem('eresto_user_figma_url', defaultUrl);
  };

  const designTokens = {
    colors: [
      { name: 'Dark Slate (Background)', hex: '#0f172a', desc: 'Warna latar belakang gelap utama (slate-900).' },
      { name: 'Dark Card Slate', hex: '#1e293b', desc: 'Panel kartu & container menu (slate-800).' },
      { name: 'Emerald Accent (Primary)', hex: '#10b981', desc: 'Elemen aktif, harga, & aksen keberhasilan (emerald-500).' },
      { name: 'Indigo Accent (Active Tab)', hex: '#4f46e5', desc: 'Tombol navigasi sidebar & tombol utama (indigo-600).' },
      { name: 'Amber Alert (Warning)', hex: '#f59e0b', desc: 'Stok kritis & modal status waspada (amber-500).' },
      { name: 'Slate Gray (Muted Muted)', hex: '#64748b', desc: 'Label sekunder & penjelas formulir (slate-550).' },
    ],
    typography: [
      { tag: 'h1', size: '32px / 2rem', font: 'Inter Black', usage: 'Judul display dashboard utama.' },
      { tag: 'h2', size: '20px / 1.25rem', font: 'Inter Bold', usage: 'Judul menu masakan & section utama.' },
      { tag: 'h3', size: '15px / 0.95rem', font: 'Inter SemiBold', usage: 'Nama item menu, nama karyawan, & badge status.' },
      { tag: 'label', size: '10px / 0.625rem', font: 'Inter Regular (Tracking Wide)', usage: 'Seksi label input formulir & text sekunder.' },
      { tag: 'mono-data', size: '12px / 0.75rem', font: 'JetBrains Mono', usage: 'Harga menu, angka transaksi pendapatan, & sandi input.' },
    ],
    components: [
      {
        name: 'Primary Button',
        snippet: `<button className="w-full py-3 bg-indigo-600 text-white rounded-xl shadow-lg transition-all active:scale-[0.98] font-bold text-xs uppercase">\n  Ubah Sandi\n</button>`
      },
      {
        name: 'Cashier Price Card',
        snippet: `<div className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-xl">\n  <span className="font-bold text-emerald-400 font-mono">Rp 45.000</span>\n</div>`
      },
      {
        name: 'Sidebar Nav Item',
        snippet: `<button className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-transparent bg-indigo-600 text-white shadow-lg shadow-indigo-650/40 font-semibold">\n  <HomeIcon className="h-4.5 w-4.5" />\n  <span>Beranda</span>\n</button>`
      }
    ]
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
            <Layers className="h-6 w-6 text-indigo-500" />
            Workspace Desain Figma & Blueprint
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Panduan High-Fidelity Design System, Spesifikasi Warna, Tipografi, dan Komponen Aplikasi Ap KASIR.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          {['desktop', 'tablet', 'mobile'].map((device) => (
            <button
              key={device}
              onClick={() => setPreviewDevice(device as any)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all outline-none ${
                previewDevice === device
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {device === 'desktop' && <Laptop className="h-3.5 w-3.5" />}
              {device === 'tablet' && <Tablet className="h-3.5 w-3.5" />}
              {device === 'mobile' && <Smartphone className="h-3.5 w-3.5" />}
              <span className="capitalize">{device}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Figma Link Integration Hub */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-slate-900/10 border border-slate-200 dark:border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-md font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-6h2v6zm0-8h-2V6h2v2z" />
              </svg>
              Tautan Project Desain Figma Aktif
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Gunakan file Figma berkualitas tinggi untuk memodifikasi tata letak kasir, ikon restoran, dan tema warna mockups Anda secara luar biasa. Anda bisa memakai link default kami atau menyematkan URL figma Anda sendiri.
          </p>
          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 truncate max-w-full block bg-indigo-50/50 dark:bg-indigo-950/30 px-2.5 py-1 rounded-xl">
            {userFigmaUrl}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <a
            href={userFigmaUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-indigo-500/30"
          >
            Buka File Figma <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => {
              setIsUrlEditing(!isUrlEditing);
              setInputUrl(userFigmaUrl);
            }}
            className="px-4 py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center gap-1.5"
          >
            {isUrlEditing ? 'Batal' : 'Ubah Link'}
          </button>
          
          {userFigmaUrl !== 'https://www.figma.com/community/file/1162464761448650392' && (
            <button
              onClick={handleResetFigmaUrl}
              className="px-3 py-3 text-red-500 hover:bg-red-500/10 text-xs font-bold rounded-xl transition-all"
              title="Reset ke Link Bawaan"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {isUrlEditing && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSaveFigmaUrl}
          className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-3"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
              Masukkan URL File Figma Anda (Community / Private Draft):
            </label>
            <p className="text-[10px] text-slate-500">
              Salin tautan dari bagian &quot;Share&quot; di workspace Figma, lalu paste di bawah untuk disimpan di akun kasir Anda secara permanen.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.figma.com/file/..."
              className="flex-grow px-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow hover:bg-indigo-500 transition-all cursor-pointer"
            >
              Simpan Link
            </button>
          </div>
        </motion.form>
      )}

      {copiedText === 'UrlSaved' && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold text-center animate-pulse">
          ✓ Link Figma berhasil diperbarui dan disimpan dalam local storage perangkat Anda!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Mockup Image Frame viewport with interactivity and custom accent simulation */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            layout
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl transition-all"
            id="figma-preview-viewport"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-2">
                  Ap_Kasir_Design_Workspace.fig (Figma High-Fidelity Draft)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">
                Original Draft
              </span>
            </div>

            {/* Simulated Live View Frame */}
            <div className="bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center p-6 border border-slate-850" style={{ minHeight: '380px' }}>
              <div
                className="transition-all duration-300 relative rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col"
                style={{
                  width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '75%' : '40%',
                  boxShadow: `0 25px 50px -12px rgba(16, 185, 129, ${shadowOpacity * 0.25})`,
                }}
              >
                {/* Upper bar inside device */}
                <div className="bg-slate-950 px-3 py-1.5 text-[9px] font-mono text-slate-500 border-b border-slate-850 flex justify-between items-center select-none">
                  <span>File: prototype / web / responsive_view</span>
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                </div>

                {/* Actual Saved Figma High Perf Image asset displayed beautifully */}
                <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
                  <img
                    src="/src/assets/images/figma_ui_mockup_1780209640559.png"
                    alt="Ap KASIR High fidelity figma draft design mockup"
                    className="w-full h-full object-cover rounded-b-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-1">
              <span>Resolusi Asset: 1024 x 1024px High Resolution PNG</span>
              <a
                href="/src/assets/images/figma_ui_mockup_1780209640559.png"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:underline"
              >
                Unduh Mentahan <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </motion.div>

          {/* Design Controls Adjuster simulation */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-4">
              <Sliders className="h-4.5 w-4.5 text-indigo-500" />
              Simulasi Parameter Desain Figma (Variables Editor)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="text-slate-400 block font-medium">Ubah Warna Aksen Primer (Accent Variable):</label>
                <div className="flex gap-2.5 items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-8 w-10 bg-transparent rounded cursor-pointer border-0 outline-none"
                  />
                  <span className="font-mono text-slate-800 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-950/50 px-2 py-1 rounded">
                    {accentColor}
                  </span>
                  <span className="text-[10px] text-slate-400 italic">Pratinjau aksen UI dasar</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400 font-medium">Kekuatan Glow Bayangan (Shadow Glow):</label>
                  <span className="font-mono text-indigo-500 font-bold">{(shadowOpacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Design Tokens Specification and Variables */}
        <div className="lg:col-span-5 space-y-6">
          {/* Color Palletes Panel */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Palette className="h-4.5 w-4.5 text-indigo-500" />
              Palet Warna Utama (Color Tokens)
            </h2>
            <div className="space-y-3">
              {designTokens.colors.map((color) => (
                <div key={color.name} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 dark:border-slate-850/60 bg-slate-50/20 dark:bg-slate-950/20 hover:border-slate-150 transition">
                  <div className="flex items-center gap-3">
                    <span 
                      className="h-8 w-8 rounded-lg shadow-sm border border-slate-250/20 block" 
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{color.name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed">{color.desc}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(color.hex, color.name)}
                    className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition text-[10px] font-mono font-bold flex items-center gap-1"
                  >
                    {copiedText === color.name ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        {color.hex}
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Scale Panel */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Type className="h-4.5 w-4.5 text-indigo-500" />
              Skala Tipografi (Typography Scale)
            </h2>
            <div className="space-y-4">
              {designTokens.typography.map((typo) => (
                <div key={typo.tag} className="border-b border-slate-50 dark:border-slate-850 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{`<${typo.tag}>`}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded text-[10px]">
                      {typo.size}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="italic">Font: {typo.font}</span>
                    <span className="text-right">{typo.usage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Code Components copyable snippets */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <FileCode className="h-4.5 w-4.5 text-indigo-500" />
              CSS & JSX Tailwind Specs (Figma Code)
            </h2>
            <div className="space-y-4 text-xs">
              {designTokens.components.map((comp) => (
                <div key={comp.name} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-900 dark:text-white">{comp.name}</span>
                    <button
                      onClick={() => handleCopy(comp.snippet, comp.name)}
                      className="p-1 text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedText === comp.name ? (
                        <>
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                          Berhasil Disalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-2.5 w-2.5" />
                          Salin Kode JSX
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-950 text-[10px] text-slate-350 font-mono rounded-xl leading-relaxed overflow-x-auto select-all border border-slate-850">
                    {comp.snippet}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
