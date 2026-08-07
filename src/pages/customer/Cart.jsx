import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, Coffee, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    discountAmount,
    taxAmount,
    serviceCharge,
    grandTotal,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-lg mx-auto py-8 animate-fade-in">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any handcrafted brews or baked goods yet."
          action={
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-lg shadow-coffee-600/30 transition flex items-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Browse Menu</span>
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Your Cart</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review items before proceeding to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      {/* Order Type Toggle (Dine-In / Takeaway / Delivery) */}
      <div className="glass-card rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Select Order Option
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Dine-In', 'Take Away', 'Delivery'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition ${
                orderType === type
                  ? 'bg-coffee-600 text-white border-coffee-600 dark:bg-amber-500 dark:text-espresso'
                  : 'border-coffee-200 dark:border-coffee-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {orderType === 'Dine-In' && (
          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
              Table Number
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. Table 05"
              className="w-full px-3.5 py-2 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
            />
          </div>
        )}
      </div>

      {/* Cart Item List */}
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div
            key={item.cartKey}
            className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-coffee-200/50 dark:border-coffee-800/40"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover bg-coffee-100"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.options?.ice && `${item.options.ice} • `}
                {item.options?.sugar && `${item.options.sugar}`}
              </p>
              {item.note && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                  "{item.note}"
                </p>
              )}
              <p className="text-xs font-extrabold text-coffee-600 dark:text-amber-400 mt-1">
                {formatCurrency(item.price * item.qty)}
              </p>
            </div>

            {/* Quantity Adjuster */}
            <div className="flex items-center gap-2 bg-coffee-50 dark:bg-espresso p-1 rounded-xl border border-coffee-200 dark:border-coffee-800">
              <button
                onClick={() => updateQuantity(item.cartKey, item.qty - 1)}
                className="w-6 h-6 rounded-lg bg-white dark:bg-espresso-light text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-slate-900 dark:text-white px-1">
                {item.qty}
              </span>
              <button
                onClick={() => updateQuantity(item.cartKey, item.qty + 1)}
                className="w-6 h-6 rounded-lg bg-white dark:bg-espresso-light text-slate-700 dark:text-slate-200 flex items-center justify-center shadow hover:bg-slate-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code Section */}
      <div className="glass-card rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Apply Coupon Code
        </label>
        {coupon ? (
          <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span className="font-bold">{coupon.code} applied!</span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs font-bold hover:underline text-rose-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Try COFFEE10 or WELCOME5"
              className="flex-1 px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800 focus:outline-none uppercase"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs rounded-xl transition"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      {/* Order Pricing Summary */}
      <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 space-y-2.5">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Coupon Discount</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Government Tax (10%)</span>
          <span>{formatCurrency(taxAmount)}</span>
        </div>

        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Service Charge</span>
          <span>{formatCurrency(serviceCharge)}</span>
        </div>

        <div className="border-t border-coffee-200 dark:border-coffee-800 pt-3 flex justify-between items-center">
          <div>
            <span className="text-sm font-black text-slate-900 dark:text-white">Total Amount</span>
            <p className="text-[10px] text-slate-500">Includes VAT & service</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-coffee-600 dark:text-amber-400 block">
              {formatCurrency(grandTotal)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ≈ {Math.round(grandTotal * 4100).toLocaleString()} ៛
            </span>
          </div>
        </div>

        {/* Proceed to Checkout Button */}
        <button
          onClick={() => navigate('/checkout')}
          className="w-full mt-4 py-4 bg-coffee-600 hover:bg-coffee-700 text-white font-extrabold rounded-2xl shadow-xl shadow-coffee-600/30 flex items-center justify-center gap-2 transition active:scale-98"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
