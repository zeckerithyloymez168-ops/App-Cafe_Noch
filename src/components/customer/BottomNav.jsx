import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTelegram } from '../../hooks/useTelegram';
import { cn } from '../../utils/cn';

export const BottomNav = () => {
  const { totalItemsCount } = useCart();
  const { triggerHaptic } = useTelegram();

  const navItems = [
    { label: 'ទំព័រដើម', path: '/', icon: Home },
    { label: 'កន្ត្រក', path: '/cart', icon: ShoppingBag, badge: totalItemsCount },
    { label: 'ការកុម្ម៉ង់', path: '/order-history', icon: Clock },
    { label: 'គណនី', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-espresso/90 backdrop-blur-lg border-t border-coffee-200/60 dark:border-coffee-800/40 px-4 py-2 sm:hidden">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => triggerHaptic('selection')}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200',
                  isActive
                    ? 'text-coffee-600 dark:text-amber-400 font-bold scale-105'
                    : 'text-slate-500 dark:text-slate-400 hover:text-coffee-600'
                )
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
