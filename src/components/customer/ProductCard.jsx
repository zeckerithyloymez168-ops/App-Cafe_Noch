import React from 'react';
import { Plus, ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useTelegram } from '../../hooks/useTelegram';
import toast from 'react-hot-toast';

export const ProductCard = ({ product, onClick }) => {
  const { addToCart, cartItems } = useCart();
  const { triggerHaptic } = useTelegram();

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock <= 0 || product.status === 'Disabled';

  // Check if item is already in cart
  const cartItem = cartItems.find((item) => item.id === product.id);
  const qtyInCart = cartItem ? cartItem.qty : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    triggerHaptic('light');
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart!`, {
      style: { borderRadius: '16px', background: '#2D1509', color: '#fff' },
    });
  };

  return (
    <div
      onClick={() => onClick && onClick(product)}
      className="group relative glass-card rounded-3xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-coffee cursor-pointer overflow-hidden border border-coffee-200/50 dark:border-coffee-800/40"
    >
      {/* Stock Tag */}
      {isOutOfStock ? (
        <span className="absolute top-5 left-5 z-10 bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Sold Out
        </span>
      ) : isLowStock ? (
        <span className="absolute top-5 left-5 z-10 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Low Stock ({product.stock})
        </span>
      ) : null}

      {/* Product Image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-coffee-100 dark:bg-coffee-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-coffee-600 dark:text-coffee-400 uppercase mb-1 block">
            {product.category}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base line-clamp-1 group-hover:text-coffee-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Add Button */}
        <div className="flex items-center justify-between pt-2 border-t border-coffee-100 dark:border-coffee-900/40 mt-auto">
          <div>
            <span className="text-base font-extrabold text-slate-900 dark:text-amber-400">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : qtyInCart > 0
                ? 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700'
                : 'bg-coffee-600 text-white shadow-coffee-600/30 hover:bg-coffee-700 hover:scale-105 active:scale-95'
            }`}
          >
            {qtyInCart > 0 ? (
              <span className="text-xs font-bold">{qtyInCart}</span>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
