import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white dark:bg-espresso-light rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 animate-pulse">
    <div className="w-full h-40 bg-coffee-200/40 dark:bg-coffee-900/40 rounded-xl mb-3" />
    <div className="h-4 bg-coffee-200/60 dark:bg-coffee-900/60 rounded w-3/4 mb-2" />
    <div className="h-3 bg-coffee-200/40 dark:bg-coffee-900/40 rounded w-1/2 mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-5 bg-coffee-200/60 dark:bg-coffee-900/60 rounded w-16" />
      <div className="w-8 h-8 bg-coffee-200/60 dark:bg-coffee-900/60 rounded-full" />
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-14 bg-coffee-200/30 dark:bg-coffee-900/30 rounded-xl w-full" />
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 bg-coffee-200/30 dark:bg-coffee-900/30 rounded-2xl" />
      ))}
    </div>
    <div className="h-72 bg-coffee-200/30 dark:bg-coffee-900/30 rounded-2xl" />
  </div>
);
