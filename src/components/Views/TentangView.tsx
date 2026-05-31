/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Github, Heart, Cpu, ShieldCheck, Database, Calendar } from 'lucide-react';
import { DeveloperProfile } from '../../types';

interface TentangViewProps {
  profile: DeveloperProfile;
}

export function TentangView({ profile }: TentangViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tentang Aplikasi & Profil</h1>
        <p className="text-xs text-slate-400 mt-1">Informasi teknologi sistem dan detail perancang perangkat lunak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Developer Card (Aesthetics Profile) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="md:col-span-1 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 shadow-xl dark:bg-slate-900 text-center flex flex-col items-center justify-between"
          id="developer-profile-card"
        >
          <div className="w-full">
            {/* Avatar block with status ring */}
            <div className="relative inline-block mb-4">
              <span className="absolute bottom-2 right-2 h-4.5 w-4.5 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-500 animate-pulse" />
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-28 w-28 rounded-2xl object-cover shadow-md border-2 border-indigo-50"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {profile.name}
            </h3>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
              {profile.role}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed italic text-justify px-1">
              "{profile.biodata}"
            </p>
          </div>

          <div className="w-full mt-6 space-y-2 pt-4 border-t border-slate-50 dark:border-slate-850/50">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Github className="h-4 w-4" /> Visit GitHub Profile
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-950/50 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Mail className="h-4 w-4" /> {profile.email}
            </a>
          </div>
        </motion.div>

        {/* Application details / stack */}
        <div className="md:col-span-2 space-y-6">
          {/* App specs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900"
            id="about-app-card"
          >
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Cpu className="h-4.5 w-4.5 text-indigo-500" />
              Sistem E-Resto & Kasir Cerdas
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 p-3">
                <span className="text-slate-400 block font-medium">Platform Versi</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">Production v1.2.0</span>
              </div>
              <div className="rounded-xl border border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 p-3">
                <span className="text-slate-400 block font-medium">Runtime Inti</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">React 19 + TypeScript</span>
              </div>
              <div className="rounded-xl border border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 p-3">
                <span className="text-slate-400 block font-medium">Mesin Animasi</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">Framer Motion Active</span>
              </div>
              <div className="rounded-xl border border-slate-50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 p-3">
                <span className="text-slate-400 block font-medium">Style Provider</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 mt-1 block">Tailwind CSS v4</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5 leading-relaxed">
              Sistem ini dirancang secara khusus untuk memenuhi tuntutan manajemen kuliner modern: mempercepat siklus sirkulasi produk kuliner, pemantauan riwayat penjualan real-time, sinkronisasi rekonsiliasi data karyawan, dan perlindungan otentikasi kata sandi.
            </p>
          </motion.div>

          {/* Core dev skills */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white p-6 shadow-sm dark:bg-slate-900"
            id="dev-skills-card"
          >
            <h2 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
              Keahlian & Toolkit Pengembang
            </h2>

            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.04 + 0.2, type: 'spring' }}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 bg-indigo-50/35 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 text-xs font-semibold cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Credits */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 py-2">
            <span>Dibuat dengan</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>oleh</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{profile.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
