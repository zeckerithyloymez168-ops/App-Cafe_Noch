import React from 'react';
import { User, Sun, Moon, Send, ShieldCheck, HeartHandshake, Coffee } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';
import { useTheme } from '../../context/ThemeContext';

export const Profile = () => {
  const { user } = useTelegram();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-2">
      {/* Profile Header Card */}
      <div className="glass-card rounded-3xl p-6 text-center border border-coffee-200/50 dark:border-coffee-800/40 relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-coffee-600 to-amber-500 text-white font-black text-2xl mx-auto flex items-center justify-center mb-3 shadow-lg shadow-coffee-600/30">
          {user?.first_name?.[0] || 'C'}
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {user?.first_name} {user?.last_name}
        </h2>
        <p className="text-xs text-coffee-600 dark:text-amber-400 font-medium">
          @{user?.username || 'telegram_user'}
        </p>
      </div>

      {/* Settings & Info list */}
      <div className="glass-card rounded-3xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 space-y-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-coffee-50/50 dark:bg-espresso/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-coffee-100 dark:bg-coffee-900/40 text-coffee-600 dark:text-amber-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Appearance</h4>
              <p className="text-[10px] text-slate-500">Dark / Light Mode</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3.5 py-1.5 bg-coffee-600 text-white text-xs font-bold rounded-xl shadow"
          >
            Toggle
          </button>
        </div>

        <a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-3 rounded-2xl hover:bg-coffee-50/50 dark:hover:bg-espresso/50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Telegram Customer Bot</h4>
              <p className="text-[10px] text-slate-500">Direct order notifications & support</p>
            </div>
          </div>
        </a>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-coffee-50/50 dark:bg-espresso/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Bakong KHQR Payments</h4>
              <p className="text-[10px] text-slate-500">Instant cashless payments enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
