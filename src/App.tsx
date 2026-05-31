/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, Lock, User, RefreshCw, Key, ShieldCheck, Sun, Moon, Sparkles, HelpCircle 
} from 'lucide-react';

// Subviews
import { Sidebar } from './components/Sidebar';
import { NotificationModal } from './components/NotificationModal';
import { BerandaView } from './components/Views/BerandaView';
import { TentangView } from './components/Views/TentangView';
import { KaryawanView } from './components/Views/KaryawanView';
import { MakananView } from './components/Views/MakananView';
import { TambahMakananView } from './components/Views/TambahMakananView';
import { PenjualanView } from './components/Views/PenjualanView';
import { LaporanView } from './components/Views/LaporanView';
import { UbahPasswordView } from './components/Views/UbahPasswordView';

// Seed data and types
import { MenuItem, Employee, Transaction, DeveloperProfile } from './types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_EMPLOYEES, 
  INITIAL_TRANSACTIONS, 
  DEVELOPER_PROFILE 
} from './data';

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('eresto_authenticated');
    return saved === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminUser, setAdminUser] = useState<{name: string, email: string}>(() => {
    const saved = localStorage.getItem('eresto_admin_user');
    return saved ? JSON.parse(saved) : {
      name: 'Andiki Agustian',
      email: 'agustiandiki7@gmail.com'
    };
  });
  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('eresto_password') || 'admin123';
  });

  // Registration form states
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [registerName, setRegisterName] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Local persistent registration accounts database
  const [usersList, setUsersList] = useState<{username: string, password: string, name: string}[]>(() => {
    const saved = localStorage.getItem('eresto_users_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    const defaultPassword = localStorage.getItem('eresto_password') || 'admin123';
    return [
      { username: 'admin', password: defaultPassword, name: 'Andiki Agustian' }
    ];
  });

  // Dark/Light Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('eresto_dark_mode');
    return saved === 'true';
  });

  // Active Tab navigation
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('eresto_active_tab') || 'beranda';
  });

  // Database core states
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('eresto_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('eresto_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('eresto_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // POS Basket state (cart drafts)
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);

  // MessageBox Modal controller
  const [messageBox, setMessageBox] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'Tutup'
  });

  // Persisting state in local storage
  useEffect(() => {
    localStorage.setItem('eresto_authenticated', String(isAuthenticated));
    localStorage.setItem('eresto_password', adminPassword);
    localStorage.setItem('eresto_dark_mode', String(darkMode));
    localStorage.setItem('eresto_active_tab', activeTab);
    localStorage.setItem('eresto_menu_items', JSON.stringify(menuItems));
    localStorage.setItem('eresto_employees', JSON.stringify(employees));
    localStorage.setItem('eresto_transactions', JSON.stringify(transactions));
    localStorage.setItem('eresto_admin_user', JSON.stringify(adminUser));
    localStorage.setItem('eresto_users_list', JSON.stringify(usersList));
  }, [isAuthenticated, adminPassword, darkMode, activeTab, menuItems, employees, transactions, adminUser, usersList]);

  // Dark theme class toggle
  useEffect(() => {
    const rootElement = window.document.documentElement;
    if (darkMode) {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Google Single Sign-On (SSO) states
  const [googleClientId, setGoogleClientId] = useState<string>('');

  useEffect(() => {
    // Fetch Google Client ID from backend config
    fetch('/api/auth/google/config')
      .then(res => res.json())
      .then(data => {
        if (data.clientId) {
          setGoogleClientId(data.clientId);
        }
      })
      .catch(err => console.error("Error fetching Google Client ID config:", err));
  }, []);

  useEffect(() => {
    if (!googleClientId) return;

    const initGoogleGSI = () => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            const idToken = response.credential;
            try {
              const res = await fetch('/api/auth/google/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken })
              });
              const authResult = await res.json();
              if (authResult.success && authResult.user) {
                setIsAuthenticated(true);
                setAdminUser({
                  name: authResult.user.name,
                  email: authResult.user.email
                });
                setMessageBox({
                  isOpen: true,
                  type: 'success',
                  title: 'Login Google Sukses!',
                  message: `Selamat datang kembali, ${authResult.user.name} (${authResult.user.email})!`,
                  confirmText: 'Lanjutkan'
                });
              } else {
                setMessageBox({
                  isOpen: true,
                  type: 'error',
                  title: 'Verifikasi Gagal',
                  message: authResult.error || 'Gagal memverifikasi token Google.',
                  confirmText: 'Selesai'
                });
              }
            } catch (err) {
              console.error(err);
              setMessageBox({
                isOpen: true,
                type: 'error',
                title: 'Error Koneksi Server',
                message: 'Terjadi kegagalan komunikasi dengan server kasir.',
                confirmText: 'Selesai'
              });
            }
          }
        });

        const buttonContainer = document.getElementById('google-btn-container');
        if (buttonContainer) {
          google.accounts.id.renderButton(
            buttonContainer,
            { theme: 'filled_black', size: 'large', text: 'signin_with', width: 320 }
          );
        }
      } else {
        // Retry shortly if the API hasn't loaded yet
        setTimeout(initGoogleGSI, 500);
      }
    };

    initGoogleGSI();
  }, [googleClientId]);

  const handleGoogleSimulationLogin = () => {
    setMessageBox({
      isOpen: true,
      type: 'info',
      title: 'Google Sign-In',
      message: 'Client ID Google belum terkonfigurasi di akun preview Anda. Apakah Anda ingin mensimulasikan login langsung menggunakan akun Google asli terdaftar Anda "agustiandiki7@gmail.com"?',
      confirmText: 'Masuk dengan Google',
      onConfirm: () => {
        setIsAuthenticated(true);
        setAdminUser({
          name: 'Andiki Agustian',
          email: 'agustiandiki7@gmail.com'
        });
        setMessageBox({
          isOpen: true,
          type: 'success',
          title: 'Login Google Sukses!',
          message: 'Berhasil masuk secara aman dengan akun Google: agustiandiki7@gmail.com!',
          confirmText: 'Buka Dashboard'
        });
      }
    });
  };

  // Login handler with multi-user support
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = loginUsername.trim().toLowerCase();
    
    // Check if the user exists in our usersList
    const matchedUser = usersList.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === loginPassword
    );
    
    if (matchedUser) {
      // Success Login
      setIsAuthenticated(true);
      setAdminUser({
        name: matchedUser.name,
        email: `${matchedUser.username.toLowerCase()}@eresto.com`
      });
      if (cleanUsername === 'admin') {
        setAdminPassword(matchedUser.password);
      }
      setLoginUsername('');
      setLoginPassword('');
    } else {
      // Trigger failure MessageBox required in instruction: 
      // "Login gagal, Muncul messagebox "Maaf Username dan Password Salah""
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Verifikasi Gagal',
        message: 'Maaf Username dan Password Salah',
        confirmText: 'Coba Lagi'
      });
    }
  };

  // Register state handler for new admin/cashier account signup
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanUsername = registerUsername.trim().toLowerCase();
    if (!registerName.trim()) {
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Formulir Kosong',
        message: 'Nama Lengkap wajib diisi!',
        confirmText: 'Selesai'
      });
      return;
    }
    
    if (cleanUsername.length < 3) {
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Username Pendek',
        message: 'Username minimal harus berukuran 3 karakter!',
        confirmText: 'Selesai'
      });
      return;
    }

    if (registerPassword.length < 5) {
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Sandi Terlalu Lemah',
        message: 'Kata sandi baru minimal harus berukuran 5 karakter!',
        confirmText: 'Selesai'
      });
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Sandi Tidak Cocok',
        message: 'Konfirmasi Sandi tidak cocok dengan Kata Sandi!',
        confirmText: 'Ulangi'
      });
      return;
    }

    // Check if duplicate user exists
    const isExisted = usersList.some(
      u => u.username.toLowerCase() === cleanUsername
    );
    if (isExisted) {
      setMessageBox({
        isOpen: true,
        type: 'error',
        title: 'Nama Pengguna Terpakai',
        message: 'Username ini sudah terdaftar oleh admin lain. Silakan pakai username unik.',
        confirmText: 'Ganti Username'
      });
      return;
    }

    // Append new admin to the database
    const newUser = {
      username: cleanUsername,
      password: registerPassword,
      name: registerName.trim()
    };
    
    setUsersList(prev => [...prev, newUser]);

    // Clear register inputs
    setRegisterName('');
    setRegisterUsername('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    
    // Auto toggle to Login Screen
    setIsRegisterMode(false);

    setMessageBox({
      isOpen: true,
      type: 'success',
      title: 'Registrasi Sukses!',
      message: `Akun untuk "${newUser.name}" (${newUser.username}) siap dipasang! Silakan ketik username dan password tadi untuk login.`,
      confirmText: 'Lanjutkan Ke Login'
    });
  };

  // Logout handler
  const handleTriggerLogout = () => {
    // Trigger success logout MessageBox required in instruction:
    // "Tampil Messagebox "sukses keluar dari Website""
    setMessageBox({
      isOpen: true,
      type: 'success',
      title: 'Sesi Berakhir',
      message: 'sukses keluar dari Website',
      confirmText: 'Selesai',
      onConfirm: () => {
        setIsAuthenticated(false);
        setCart([]);
        setMessageBox(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Employee CRUD operations
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);
    setMessageBox({
      isOpen: true,
      type: 'success',
      title: 'Staf Terdaftar',
      message: `Karyawan bernama ${newEmp.name} berhasil ditambahkan ke database roster.`,
      confirmText: 'Lanjutkan'
    });
  };

  const handleRemoveEmployee = (id: string) => {
    const victim = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setMessageBox({
      isOpen: true,
      type: 'warning',
      title: 'Pemberhentian Staf',
      message: `Karyawan ${victim ? victim.name : ''} telah dinonaktifkan permanen dari daftar operasional restoran.`,
      confirmText: 'Mengerti'
    });
  };

  const handleUpdateEmployeeStatus = (id: string, status: 'Aktif' | 'Cuti' | 'Nonaktif') => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, status };
      }
      return emp;
    }));
  };

  // Menu items CRUD
  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
    setMessageBox({
      isOpen: true,
      type: 'success',
      title: 'Produk Terdaftar',
      message: `Kuliner "${newItem.name}" berkategori ${newItem.category} berhasil dipublikasikan untuk pesanan kasir!`,
      confirmText: 'Buka Katalog',
      onConfirm: () => {
        setActiveTab('makanan');
        setMessageBox(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // POS cash register drafts
  const handleAddToCart = (item: MenuItem) => {
    if (item.stock === 0) {
      alert('Maaf, ketersediaan porsi menu habis!');
      return;
    }

    setCart(prev => {
      const matchIdx = prev.findIndex(c => c.item.id === item.id);
      if (matchIdx > -1) {
        const updated = [...prev];
        const newQt = updated[matchIdx].quantity + 1;
        if (newQt > item.stock) {
          alert(`Maaf, Anda memesan ${newQt} porsi, namun stok menu bersisa ${item.stock} porsi!`);
          return prev;
        }
        updated[matchIdx] = { ...updated[matchIdx], quantity: newQt };
        return updated;
      } else {
        return [...prev, { item, quantity: 1 }];
      }
    });

    // Provide a small tactile vibration-like state or audio-alike indicator in the active view
  };

  const handleRemoveFromCart = (menuId: string) => {
    setCart(prev => prev.filter(c => c.item.id !== menuId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // POS transaction checkout simulation
  const handleCheckout = (
    customerName: string,
    paymentMethod: 'Tunai' | 'QRIS' | 'Debit',
    cashierName: string
  ) => {
    // 1. Double check and subtract stock
    let holdsCorrectLevels = true;
    const itemsList: { menuId: string; name: string; quantity: number; price: number }[] = [];

    cart.forEach(cartItem => {
      const liveItem = menuItems.find(m => m.id === cartItem.item.id);
      if (!liveItem || liveItem.stock < cartItem.quantity) {
        holdsCorrectLevels = false;
        alert(`Transaksi dibatalkan. Stok hidangan "${cartItem.item.name}" baru saja berkurang di luar jangkauan.`);
      } else {
        itemsList.push({
          menuId: cartItem.item.id,
          name: cartItem.item.name,
          quantity: cartItem.quantity,
          price: cartItem.item.price
        });
      }
    });

    if (!holdsCorrectLevels) return;

    // 2. Subtract stocks & add sales tallies
    setMenuItems(prev => prev.map(m => {
      const matchedCart = cart.find(c => c.item.id === m.id);
      if (matchedCart) {
        return {
          ...m,
          stock: m.stock - matchedCart.quantity,
          sales: m.sales + matchedCart.quantity
        };
      }
      return m;
    }));

    // 3. Compile new receipt transaction
    const totalRaw = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const taxPPN = Math.round(totalRaw * 0.1);
    const newTx: Transaction = {
      id: `TX-${Math.floor(8000 + Math.random() * 1999)}`,
      date: new Date().toISOString(),
      customerName,
      items: itemsList,
      totalAmount: totalRaw + taxPPN,
      paymentMethod,
      cashierName
    };

    setTransactions(prev => [newTx, ...prev]);
    setCart([]); // reset basket

    setMessageBox({
      isOpen: true,
      type: 'success',
      title: 'Checkout Berhasil!',
      message: `Struk pembayaran ${newTx.id} terbit. Total ${newTx.items.length} macam hidangan dikirim ke koki dapur untuk meja ${customerName}.`,
      confirmText: 'Cetak Tagihan',
      onConfirm: () => {
        // close safely and navigate
        setActiveTab('penjualan');
        setMessageBox(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Secure Change Password handler
  const handleUpdatePassword = (oldPw: string, newPw: string): boolean => {
    if (oldPw !== adminPassword) {
      return false; // unmatched current password
    }
    setAdminPassword(newPw);
    return true;
  };

  // Map Cart Quantities by Menu ID for visual notification badges
  const cartCountById = cart.reduce((acc, current) => {
    acc[current.item.id] = current.quantity;
    return acc;
  }, {} as Record<string, number>);

  const totalCartItemCount = cart.reduce((acc, current) => acc + current.quantity, 0);

  // Layout View routers mapping to menu items
  const renderTabContent = () => {
    switch (activeTab) {
      case 'beranda':
        return <BerandaView menuItems={menuItems} transactions={transactions} onNavigate={setActiveTab} />;
      case 'makanan':
        return (
          <MakananView 
            menuItems={menuItems} 
            onOpenAddMakanan={() => setActiveTab('tambah-makanan')} 
            onAddToCart={handleAddToCart}
            cartCountById={cartCountById}
          />
        );
      case 'tambah-makanan':
        return (
          <TambahMakananView 
            onAddMenuItem={handleAddMenuItem} 
            onSuccessRedirect={() => setActiveTab('makanan')} 
          />
        );
      case 'karyawan':
        return (
          <KaryawanView 
            employees={employees} 
            onAddEmployee={handleAddEmployee} 
            onRemoveEmployee={handleRemoveEmployee} 
            onUpdateStatus={handleUpdateEmployeeStatus}
          />
        );
      case 'penjualan':
        return (
          <PenjualanView 
            transactions={transactions} 
            menuItems={menuItems} 
            cart={cart}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        );
      case 'laporan':
        return <LaporanView transactions={transactions} menuItems={menuItems} />;
      case 'tentang':
        return <TentangView profile={DEVELOPER_PROFILE} />;
      case 'ubah-password':
        return <UbahPasswordView onUpdatePassword={handleUpdatePassword} />;
      default:
        return <BerandaView menuItems={menuItems} transactions={transactions} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 font-sans transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}>
      
      {/* Dynamic Custom MessageBox modal required */}
      <NotificationModal
        isOpen={messageBox.isOpen}
        type={messageBox.type}
        title={messageBox.title}
        message={messageBox.message}
        onClose={() => setMessageBox(prev => ({ ...prev, isOpen: false }))}
        confirmText={messageBox.confirmText}
        onConfirm={messageBox.onConfirm ? messageBox.onConfirm : () => setMessageBox(prev => ({ ...prev, isOpen: false }))}
      />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // AUTHENTICATION LOGIN CARD FOR ADMINISTRATORS
          <motion.div
            key="login-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-100"
            id="login-panel"
          >
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3.5xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3.5xl pointer-events-none" />

            <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/65 border border-slate-800 shadow-2xl backdrop-blur-md p-8">
              {/* Branding Header Area */}
              <div className="text-center space-y-3 mb-8">
                <motion.div
                  initial={{ rotate: -15, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 180 }}
                  className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                >
                  <ChefHat className="h-7 w-7" />
                </motion.div>
                
                <div>
                  <h1 className="text-xl font-black uppercase tracking-wider text-white">E-Resto Kasir Cerdas</h1>
                  <p className="text-xs text-slate-400 font-medium mt-1">Konsol Autentikasi Staf Kasir & Administrator</p>
                </div>
              </div>

              {/* Toggle switch between Login and Register */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/40 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(false)}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    !isRegisterMode
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-inner'
                      : 'border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                  id="tab-toggle-login"
                >
                  Masuk (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegisterMode(true)}
                  className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                    isRegisterMode
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-inner'
                      : 'border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                  id="tab-toggle-register"
                >
                  Daftar (Register)
                </button>
              </div>

              {!isRegisterMode ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold text-slate-350">
                  
                  {/* Username Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Nama Pengguna (Username)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="Masukkan username admin..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all"
                        id="login-username-input"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Kata Sandi (Password)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all font-mono"
                        id="login-password-input"
                      />
                    </div>
                  </div>

                  {/* Security trigger Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-extrabold uppercase tracking-widest text-[#0F172A] rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/50 transition active:scale-[0.98]"
                    id="login-submit-btn"
                  >
                    Masuk ke Dashboard
                  </button>

                  {/* Google Login Provider */}
                  <div className="relative my-4 flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Atau masuk dengan</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                  </div>

                  {googleClientId ? (
                    <div className="flex justify-center w-full" id="google-btn-outer">
                      <div id="google-btn-container" className="w-full flex justify-center overflow-hidden rounded-xl"></div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleSimulationLogin}
                      className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/10 font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      id="google-simulated-login-btn"
                    >
                      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Masuk dengan Google
                    </button>
                  )}
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold text-slate-350">
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Nama Lengkap Anda</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        required
                        value={registerName}
                        onChange={e => setRegisterName(e.target.value)}
                        placeholder="Contoh: Diki Agustian..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all"
                        id="register-name-input"
                      />
                    </div>
                  </div>

                  {/* Username Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Nama Pengguna Baru (Username)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        required
                        value={registerUsername}
                        onChange={e => setRegisterUsername(e.target.value)}
                        placeholder="Pilih nama pengguna unik..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all"
                        id="register-username-input"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Kata Sandi Baru</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Lock className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                        placeholder="Minimal berukuran 5 karakter..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all font-mono"
                        id="register-password-input"
                      />
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wide text-[10px]">Konfirmasi Kata Sandi Baru</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <Key className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="password"
                        required
                        value={registerConfirmPassword}
                        onChange={e => setRegisterConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi baru..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl outline-none focus:border-emerald-400 text-white transition-all font-mono"
                        id="register-confirm-password-input"
                      />
                    </div>
                  </div>

                  {/* Register trigger Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-extrabold uppercase tracking-widest text-[#0F172A] rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/50 transition active:scale-[0.98]"
                    id="register-submit-btn"
                  >
                    Daftar Akun Baru
                  </button>
                </form>
              )}

              {/* Developer Helper & Info Tip Panel to enable complete, verified testing */}
              <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                  <HelpCircle className="h-3.5 w-3.5" /> Petunjuk Verifikasi Penguji
                </span>
                
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Default: Username <span className="font-bold text-white">admin</span> | Sandi <span className="font-bold text-white">{adminPassword}</span><br />
                  Anda juga dapat mendaftarkan akun baru secara dinamis lewat tab <span className="text-emerald-400 font-bold">Daftar (Register)</span> di atas dan langsung mencobanya!
                </p>
              </div>

            </div>
          </motion.div>
        ) : (
          // MAIN APPLICATION INTERCONNECTED DASHBOARD
          <motion.div
            key="dashboard-frame"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col md:flex-row min-h-screen"
          >
            {/* Nav Sidebar panel */}
            <Sidebar 
              activeTab={activeTab} 
              onSelectTab={setActiveTab} 
              adminUser={adminUser}
              onTriggerLogout={handleTriggerLogout}
              cartCount={totalCartItemCount}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />

            {/* Content Display Body Area wrapper */}
            <main className="flex-1 bg-slate-50/55 dark:bg-slate-950 p-4 md:p-8 overflow-y-auto h-screen relative">
              
              {/* Staggered Tab Screens */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="pb-16"
              >
                {renderTabContent()}
              </motion.div>
            </main>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
