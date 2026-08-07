import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Coffee,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'ផ្ទាំងគ្រប់គ្រង (Dashboard)', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'បញ្ជីម៉ឺនុយ (Menu)', path: '/admin/menu', icon: Coffee },
    { label: 'ការកុម្ម៉ង់ (Orders)', path: '/admin/orders', icon: ShoppingBag },
    { label: 'ស្តុកគ្រឿងផ្សំ (Stock)', path: '/admin/stock', icon: Package },
    { label: 'របាយការណ៍ (Reports)', path: '/admin/reports', icon: BarChart3 },
    { label: 'ការកំណត់ (Settings)', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-white/90 dark:bg-espresso-light/90 border-r border-coffee-200/50 dark:border-coffee-800/40 flex flex-col justify-between p-4 min-h-screen sticky top-0 backdrop-blur-md">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-coffee-100 dark:border-coffee-800/40">
          <div className="w-10 h-10 rounded-2xl bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso flex items-center justify-center font-black shadow-lg shadow-coffee-600/30">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
              Café Artisanal
            </h1>
            <span className="text-[11px] text-coffee-600 dark:text-coffee-400 font-semibold">
              ប្រព័ន្ធគ្រប់គ្រង (Admin)
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso shadow-lg shadow-coffee-600/20 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-coffee-100/60 dark:hover:bg-coffee-900/40 hover:text-coffee-700 dark:hover:text-amber-300'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Theme Toggle */}
      <div className="pt-4 border-t border-coffee-100 dark:border-coffee-800/40 space-y-3">
        <div className="px-3 py-2 bg-coffee-50 dark:bg-espresso rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-coffee-200 dark:bg-coffee-800 flex items-center justify-center text-xs font-bold text-coffee-800 dark:text-coffee-200">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {user?.username || 'Admin'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{user?.role || 'អ្នកគ្រប់គ្រង'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>ចាកចេញ (Sign Out)</span>
        </button>
      </div>
    </aside>
  );
};
