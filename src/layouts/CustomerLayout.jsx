import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { BottomNav } from '../components/customer/BottomNav';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-coffee-50 dark:bg-espresso text-slate-800 dark:text-slate-100 transition-colors">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 pb-24 sm:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
