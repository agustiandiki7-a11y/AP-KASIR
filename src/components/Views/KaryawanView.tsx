/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Search, Trash2, Shield, Mail, Phone, Calendar, Briefcase, DollarSign, X } from 'lucide-react';
import { Employee } from '../../types';

interface KaryawanViewProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  onRemoveEmployee: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Aktif' | 'Cuti' | 'Nonaktif') => void;
}

export function KaryawanView({
  employees,
  onAddEmployee,
  onRemoveEmployee,
  onUpdateStatus
}: KaryawanViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Semua');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Manager' | 'Kasir' | 'Koki' | 'Pelayan'>('Pelayan');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newStatus, setNewStatus] = useState<'Aktif' | 'Cuti' | 'Nonaktif'>('Aktif');

  // Filter lists
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedRoleFilter === 'Semua') {
      return matchesSearch;
    }
    return matchesSearch && emp.role === selectedRoleFilter;
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400';
      case 'Kasir': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Koki': return 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400';
      default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-850 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-none';
      case 'Cuti': return 'bg-amber-500 text-white shadow-amber-100 dark:shadow-none';
      default: return 'bg-slate-400 text-white';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone || !newSalary) {
      alert('Mohon lengkapi semua baris input data!');
      return;
    }

    const newEmp: Employee = {
      id: `emp-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      role: newRole,
      email: newEmail,
      phone: newPhone,
      salary: parseFloat(newSalary) || 0,
      status: newStatus,
      joinDate: new Date().toISOString().split('T')[0]
    };

    onAddEmployee(newEmp);
    
    // reset
    setNewName('');
    setNewRole('Pelayan');
    setNewEmail('');
    setNewPhone('');
    setNewSalary('');
    setNewStatus('Aktif');
    setIsAddFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Roster & Data Karyawan</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar staf, penyesuaian gaji, posisi, dan kehadiran operasional.</p>
        </div>
        <button
          onClick={() => setIsAddFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-colors"
          id="open-add-karyawan-form"
        >
          <UserPlus className="h-4.5 w-4.5" /> Tambah Staf Baru
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari karyawan berdasarkan nama atau email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            id="employee-search-input"
          />
        </div>
        <div className="flex gap-2">
          {['Semua', 'Manager', 'Kasir', 'Koki', 'Pelayan'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                selectedRoleFilter === role
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-slate-150 text-slate-600 dark:bg-slate-950 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredEmployees.map((emp, index) => (
            <motion.div
              layout
              key={emp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-5 shadow-sm dark:bg-slate-900 group"
              id={`employee-card-${emp.id}`}
            >
              {/* Badge Role and Join Date */}
              <div className="flex justify-between items-start">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getRoleColor(emp.role)}`}>
                  {emp.role}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3" /> {emp.joinDate}
                </span>
              </div>

              {/* Avatar and Info */}
              <div className="mt-4 flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center border border-slate-200/50 dark:border-slate-850">
                  <span className="text-md font-extrabold text-indigo-600 uppercase">
                    {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug truncate pr-6">
                    {emp.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{emp.id}</span>
                </div>
              </div>

              {/* Contact and Salary */}
              <div className="mt-5 space-y-2 border-t border-slate-50 dark:border-slate-850/50 pt-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center justify-between mt-3 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-850">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Gaji Tetap:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{formatRupiah(emp.salary)}</span>
                </div>
              </div>

              {/* Footer Actions / Status Toggles */}
              <div className="mt-5 pt-3.5 border-t border-slate-50 dark:border-slate-850/50 flex justify-between items-center">
                <div className="flex gap-1 items-center">
                  <span className="text-[10px] text-slate-400 font-semibold mr-1 uppercase">Opsi Kehadiran:</span>
                  {(['Aktif', 'Cuti', 'Nonaktif'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => onUpdateStatus(emp.id, status)}
                      className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-all ${
                        emp.status === status
                          ? getStatusColor(status)
                          : 'bg-slate-50 text-slate-400 dark:bg-slate-950 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onRemoveEmployee(emp.id)}
                  className="p-1 px-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  id={`remove-emp-btn-${emp.id}`}
                  title="Berhentikan Karyawan"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Employee Dialog overlay */}
      <AnimatePresence>
        {isAddFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddFormOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              className="relative w-full max-w-md bg-white border border-slate-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl p-6 shadow-2xl"
              id="add-employee-modal"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-850 pb-3">
                <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-indigo-600" /> Tambah Karyawan Baru
                </h3>
                <button
                  onClick={() => setIsAddFormOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Contoh: Rian Permadi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Posisi / Peran</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Kasir">Kasir</option>
                      <option value="Koki">Koki</option>
                      <option value="Pelayan">Pelayan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Porsi Kehadiran</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Alamat Email Kerja</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="Contoh: rian.permadi@eresto.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">No. Handphone (WA)</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Gaji Pokok bulanan (Rp)</label>
                    <input
                      type="number"
                      required
                      value={newSalary}
                      onChange={e => setNewSalary(e.target.value)}
                      placeholder="4500000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 rounded-xl focus:border-indigo-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddFormOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-150 hover:bg-slate-50 dark:border-slate-850 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-100 dark:shadow-none"
                    id="submit-new-employee"
                  >
                    Simpan Roster Staf
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
