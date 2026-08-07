import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell } from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50 dark:bg-espresso">
        <div className="w-10 h-10 border-4 border-coffee-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-coffee-50 dark:bg-espresso text-slate-800 dark:text-slate-100 transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-espresso/80 backdrop-blur-md border-b border-coffee-200/50 dark:border-coffee-800/40 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Management Portal
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live Store Performance & Orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-coffee-100/60 dark:bg-espresso-light/60 text-slate-700 dark:text-amber-400 hover:bg-coffee-200/60 dark:hover:bg-coffee-900/60 transition border border-coffee-200/40 dark:border-coffee-800/40"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
