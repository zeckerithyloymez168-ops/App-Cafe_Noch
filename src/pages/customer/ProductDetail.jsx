import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Coffee, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useTelegram } from '../../hooks/useTelegram';
import toast from 'react-hot-toast';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { triggerHaptic } = useTelegram();

  const [qty, setQty] = useState(1);
  const [iceLevel, setIceLevel] = useState('Normal Ice');
  const [sugarLevel, setSugarLevel] = useState('100% Sweet');
  const [specialNote, setSpecialNote] = useState('');

  if (!product) return null;

  const isCoffee = ['Espresso', 'Cold Brew', 'Frappe', 'Tea & Non-Coffee'].includes(product.category);

  const handleAddToCart = () => {
    triggerHaptic('medium');
    addToCart(product, qty, {
      ice: isCoffee ? iceLevel : undefined,
      sugar: isCoffee ? sugarLevel : undefined,
      note: specialNote,
    });
    toast.success(`Added ${qty}x ${product.name} to cart!`, {
      style: { borderRadius: '16px', background: '#2D1509', color: '#fff' },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full bg-white/80 dark:bg-espresso/80 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 bg-coffee-100 dark:bg-coffee-950">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-coffee-900/80 backdrop-blur-md text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
            {formatCurrency(product.price)}
          </div>
        </div>

        {/* Header */}
        <div className="mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-coffee-600 dark:text-amber-400">
            {product.category}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {product.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {product.description}
          </p>
        </div>

        {/* Drink Customization Options */}
        {isCoffee && (
          <div className="space-y-4 my-5 border-t border-b border-coffee-100 dark:border-coffee-800/40 py-4">
            {/* Ice Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Ice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['No Ice', 'Less Ice', 'Normal Ice'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setIceLevel(level)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      iceLevel === level
                        ? 'bg-coffee-600 text-white border-coffee-600 dark:bg-amber-500 dark:text-espresso font-bold'
                        : 'border-coffee-200 dark:border-coffee-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Sugar Level */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Sweetness Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['50% Less', '75% Normal', '100% Sweet'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setSugarLevel(sug)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition ${
                      sugarLevel === sug
                        ? 'bg-coffee-600 text-white border-coffee-600 dark:bg-amber-500 dark:text-espresso font-bold'
                        : 'border-coffee-200 dark:border-coffee-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
            Special Instructions
          </label>
          <input
            type="text"
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="e.g. Extra hot, oat milk substitute..."
            className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Quantity & Confirm Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-coffee-50 dark:bg-espresso p-1.5 rounded-2xl border border-coffee-200 dark:border-coffee-800">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-xl bg-white dark:bg-espresso-light text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-slate-900 dark:text-white px-2 text-sm">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-white dark:bg-espresso-light text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3.5 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-lg shadow-coffee-600/30 flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart ({formatCurrency(product.price * qty)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
