import React from 'react';
import { cn } from '../../utils/cn';

export const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={cn(
              'px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm',
              isActive
                ? 'bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso font-bold shadow-coffee/30 scale-105'
                : 'bg-white/80 dark:bg-espresso-light/80 text-slate-600 dark:text-slate-300 hover:bg-coffee-100 dark:hover:bg-coffee-900/50 border border-coffee-200/50 dark:border-coffee-800/40'
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
