import React from 'react';
import { Coffee, ShoppingBag, ClipboardList, AlertCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Coffee,
  title = 'No Items Found',
  description = 'There are no items matching your criteria at the moment.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-2xl my-6">
    <div className="w-16 h-16 rounded-full bg-coffee-100 dark:bg-coffee-900/50 flex items-center justify-center text-coffee-600 dark:text-coffee-400 mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
    {action && <div>{action}</div>}
  </div>
);
