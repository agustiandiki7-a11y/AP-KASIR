/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Lock, Eye, EyeOff, ShieldAlert, Check } from 'lucide-react';

interface UbahPasswordViewProps {
  onUpdatePassword: (oldPw: string, newPw: string) => boolean;
}

export function UbahPasswordView({ onUpdatePassword }: UbahPasswordViewProps) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  
  // Visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status error feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPw || !newPw || !confirmPw) {
      setStatusMessage({ text: 'Mohon isi semua kolom kata sandi!', type: 'error' });
      return;
    }

    if (newPw !== confirmPw) {
      setStatusMessage({ text: 'Konfirmasi Sandi Baru tidak cocok!', type: 'error' });
      return;
    }

    if (newPw.length < 5) {
      setStatusMessage({ text: 'Kata sandi baru minimal harus berukuran 5 karakter!', type: 'error' });
      return;
    }

    const wasSuccessful = onUpdatePassword(currentPw, newPw);
    if (wasSuccessful) {
      setStatusMessage({ text: 'Sandi berhasil didefinisikan ulang secara aman!', type: 'success' });
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } else {
      setStatusMessage({ text: 'Kata Sandi Lama yang Anda ketikkan tidak cocok!', type: 'error' });
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ubah Password Admin</h1>
        <p className="text-xs text-slate-400 mt-1">Perbarui kode otentikasi login konsol kontrol Anda secara periodik.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 shadow-xl dark:bg-slate-900"
        id="change-password-card"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-705 dark:text-slate-300">
          
          {/* Status message */}
          {statusMessage.type && (
            <div className={`p-3.5 rounded-xl border flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                : 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:text-rose-450'
            }`}>
              <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">Kata Sandi Lama</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPw}
                onChange={e => {
                  setCurrentPw(e.target.value);
                  setStatusMessage({ text: '', type: null });
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white font-mono"
                id="old-password-input"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <hr className="border-slate-50 dark:border-slate-850/50 my-2" />

          {/* New Password */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Key className="h-4 w-4" />
              </span>
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPw}
                onChange={e => {
                  setNewPw(e.target.value);
                  setStatusMessage({ text: '', type: null });
                }}
                placeholder="Min. 5 karakter"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white font-mono"
                id="new-password-input"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-slate-500 dark:text-slate-400 mb-1">Konfirmasi Sandi Baru</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Key className="h-4 w-4" />
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPw}
                onChange={e => {
                  setConfirmPw(e.target.value);
                  setStatusMessage({ text: '', type: null });
                }}
                placeholder="Ketik ulang sandi baru..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white font-mono"
                id="confirm-password-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100/50 dark:border-slate-850/50 mt-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Ketentuan Kata Sandi</h4>
            <ul className="text-[10px] text-slate-400 space-y-1 pr-1.5 list-disc pl-3 font-medium leading-relaxed">
              <li>Berukuran minimal 5 karakter demi pertahanan keamanan sistem.</li>
              <li>Pastikan sandi baru dan konfirmasi cocok 100%.</li>
              <li>Jangan beritahukan kata sandi Anda kepada kru pelayanan yang tidak memiliki wewenang kontrol keuangan.</li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-150 dark:shadow-none transition font-semibold text-xs flex items-center justify-center gap-1.5"
            id="save-new-password"
          >
            <Check className="h-4.5 w-4.5" /> Simpan Kata Sandi Baru
          </button>

        </form>
      </motion.div>
    </div>
  );
}
