/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Utensils, PlusCircle, Users, ShoppingCart, BarChart3, Info, Key, LogOut, 
  Menu, X, Sparkles, ChefHat, Dot, Sun, Moon
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  adminUser: { name: string; email: string };
  onTriggerLogout: () => void;
  cartCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Sidebar({ activeTab, onSelectTab, adminUser, onTriggerLogout, cartCount, darkMode, onToggleDarkMode }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Core navigation items mimicking the test modules in order
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home, badge: null },
    { id: 'makanan', label: 'Menu Makanan', icon: Utensils, badge: '6 Porsi' },
    { id: 'tambah-makanan', label: 'Tambah Makanan', icon: PlusCircle, badge: null },
    { id: 'karyawan', label: 'Menu Karyawan', icon: Users, badge: null },
    { id: 'penjualan', label: 'Menu Penjualan', icon: ShoppingCart, badge: cartCount > 0 ? `${cartCount} Draft` : null },
    { id: 'laporan', label: 'Menu Laporan', icon: BarChart3, badge: 'Periodik' },
    { id: 'tentang', label: 'Menu Tentang', icon: Info, badge: null },
    { id: 'ubah-password', label: 'Ubah Password', icon: Key, badge: null },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 px-4 py-3.5 text-white sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ChefHat className="h-5 w-5" />
          </span>
          <span className="font-extrabold text-sm uppercase tracking-wider">E-Resto Kasir</span>
        </div>
        <div className="flex items-center gap-3">
          {cartCount > 0 && (
            <span className="text-[10px] bg-indigo-600 text-white font-bold h-5 w-12 flex items-center justify-center rounded-full">
              {cartCount} DRAFT
            </span>
          )}
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-800"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
            id="theme-toggler-mobile"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400 fill-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Navigation Drawer Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-10 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 p-5 transform md:transform-none transition-transform duration-300 ease-out flex flex-col justify-between h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        id="applet-sidebar"
      >
        {/* Upper section Branding */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/10">
                <ChefHat className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="font-extrabold text-[#F8FAFC] block tracking-wider uppercase text-xs">E-Resto Kasir</span>
                <span className="text-[9px] text-[#A7F3D0] inline-flex items-center font-bold tracking-widest mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" /> ONLINE
                </span>
              </div>
            </div>
            
            {/* Close button for mobile inside drawer */}
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 bg-slate-800 hover:bg-slate-750 text-slate-400 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links list */}
          <nav className="space-y-1.5 max-h-[calc(100vh-270px)] overflow-y-auto pr-1">
            {navItems.map(item => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id || (item.id === 'makanan' && activeTab === 'tambah-makanan');
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold select-none transition-all duration-200 outline-none ${
                    isActive
                      ? 'bg-indigo-600 border-indigo-600/50 text-white shadow-lg shadow-indigo-650/40'
                      : 'border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                  id={`nav-tab-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 font-bold uppercase rounded ${
                      isActive ? 'bg-indigo-850 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Brand Admin profile footer & Logout trigger */}
        <div className="border-t border-slate-800 pt-5 space-y-4">
          <div className="flex items-center justify-between gap-2 px-1.5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <span className="font-extrabold text-xs text-indigo-300 uppercase">
                  {adminUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </span>
              </div>
              <div className="flex-grow truncate max-w-[110px]">
                <span className="block text-xs font-bold text-slate-200 truncate">{adminUser.name}</span>
                <span className="block text-[10px] text-slate-500 truncate">{adminUser.email}</span>
              </div>
            </div>

            <button
              onClick={onToggleDarkMode}
              className="p-1.5 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl transition-all"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
              id="theme-toggler"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400 fill-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onTriggerLogout();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-450 hover:bg-rose-950/20 hover:text-rose-400 border border-transparent hover:border-rose-950/30 transition duration-150"
            id="nav-logout-btn"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
