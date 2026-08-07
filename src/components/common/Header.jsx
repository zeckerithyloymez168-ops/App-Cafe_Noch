import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon, ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-espresso/80 backdrop-blur-md border-b border-coffee-200/50 dark:border-coffee-800/40 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso flex items-center justify-center font-black shadow-md shadow-coffee-600/20 group-hover:scale-105 transition">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-coffee-600 dark:group-hover:text-amber-400 transition">
              Café Artisanal
            </h1>
            <p className="text-[10px] text-coffee-600 dark:text-coffee-400 font-semibold tracking-wider uppercase">
              Coffee & Bakery
            </p>
          </div>
        </NavLink>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-coffee-100/60 dark:bg-espresso-light/60 text-slate-700 dark:text-amber-400 hover:bg-coffee-200/60 dark:hover:bg-coffee-900/60 transition border border-coffee-200/40 dark:border-coffee-800/40"
            title="Toggle Light/Dark Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Customer Cart Link (Desktop) */}
          <NavLink
            to="/cart"
            className="relative hidden sm:flex items-center gap-2 px-4 py-2.5 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-md shadow-coffee-600/30 transition active:scale-95 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {totalItemsCount > 0 && (
              <span className="bg-amber-400 text-espresso font-extrabold px-2 py-0.5 rounded-full text-[10px]">
                {totalItemsCount}
              </span>
            )}
          </NavLink>

          {/* Admin Link */}
          <NavLink
            to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-coffee-100 dark:bg-coffee-900/50 text-coffee-700 dark:text-amber-300 hover:bg-coffee-200 dark:hover:bg-coffee-800/60 text-xs font-semibold border border-coffee-200/50 dark:border-coffee-800/40 transition"
          >
            <ShieldCheck className="w-4 h-4 text-coffee-600 dark:text-amber-400" />
            <span className="hidden sm:inline">{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
