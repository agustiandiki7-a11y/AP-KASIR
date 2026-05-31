/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  confirmText?: string;
  onConfirm?: () => void;
}

export function NotificationModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  confirmText = 'Tutup',
  onConfirm
}: NotificationModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-emerald-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
      case 'info':
        return <Info className="h-12 w-12 text-indigo-500" />;
    }
  };

  const getThemeClasses = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50/80 dark:bg-emerald-950/20',
          border: 'border-emerald-100',
          button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 focus:ring-emerald-500',
        };
      case 'error':
        return {
          bg: 'bg-rose-50/80 dark:bg-rose-950/20',
          border: 'border-rose-100',
          button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200 focus:ring-rose-500',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/80 dark:bg-amber-950/20',
          border: 'border-amber-100',
          button: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 focus:ring-amber-500',
        };
      case 'info':
        return {
          bg: 'bg-indigo-50/80 dark:bg-indigo-950/20',
          border: 'border-indigo-100',
          button: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 focus:ring-indigo-500',
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 15, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={`relative w-full max-w-sm overflow-hidden rounded-2xl border ${theme.border} bg-white p-6 text-center shadow-2xl dark:bg-slate-900`}
            id="custom-messagebox"
          >
            {/* Close Button top-right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon & Details */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="mb-4"
              >
                {getIcon()}
              </motion.div>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight mb-2">
                {title}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 px-2">
                {message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => {
                  if (onConfirm) {
                    onConfirm();
                  } else {
                    onClose();
                  }
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-white text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 shadow-lg ${theme.button}`}
                id="messagebox-confirm-btn"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
