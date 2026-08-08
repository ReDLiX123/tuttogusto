'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';

const SECRET_ADMIN_KEY = 'tutto2026';
const AUTH_STORAGE_KEY = 'tuttogusto_admin_auth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check URL parameters for secret key query ?key=tutto2026
    const urlParams = new URLSearchParams(window.location.search);
    const keyParam = urlParams.get('key');

    if (keyParam === SECRET_ADMIN_KEY) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setChecking(false);
      return;
    }

    // 2. Check localStorage session
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim() === SECRET_ADMIN_KEY) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Неверный ключ доступа. Попробуйте еще раз.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-stone-400 text-xs">
        Проверка доступа...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="glass-panel p-8 rounded-3xl border border-[#D4A373]/30 max-w-md w-full space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-[#D4A373]/10 pointer-events-none">
            <Lock className="w-32 h-32 -mr-8 -mt-8" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A373]/15 border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373]">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-stone-100">Доступ ограничен</h2>
            <p className="text-xs text-stone-400">
              Вход в Панель управления «Туттогусто» защищен секретным ключом.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Секретный ключ доступа
              </label>
              <input
                type="password"
                required
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setError('');
                }}
                placeholder="Введите секретный ключ..."
                className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm placeholder-stone-500 focus:outline-none focus:border-[#D4A373] transition-all"
              />
              {error && <p className="text-xs text-red-400 mt-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 font-extrabold rounded-xl text-xs shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Войти в систему</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-500 text-center relative z-10">
            Подсказка для тестирования: секретный ключ <strong className="text-stone-300">tutto2026</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Admin Security Status & Logout Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900/60 rounded-xl border border-stone-800/80 text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Авторизован админ-доступ (ключ: tutto2026)</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-stone-400 hover:text-red-400 transition-colors font-bold text-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Выйти</span>
        </button>
      </div>

      {children}
    </div>
  );
};
