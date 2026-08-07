import React from 'react';
import { cn } from '../../utils/cn';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'coffee' }) => {
  const colorStyles = {
    coffee: 'bg-coffee-100 text-coffee-600 dark:bg-coffee-900/40 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
  };

  return (
    <div className="glass-card rounded-3xl p-5 flex items-center justify-between border border-coffee-200/50 dark:border-coffee-800/40 transition-transform duration-300 hover:-translate-y-1">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{value}</h3>
        {subtext && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{subtext}</p>}
      </div>

      <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner', colorStyles[color])}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
