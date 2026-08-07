import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Banknote, QrCode, ArrowLeft, CheckCircle2, User, Phone } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTelegram } from '../../hooks/useTelegram';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../services/api';
import { KHQRModal } from '../../components/customer/KHQRModal';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const {
    cartItems,
    grandTotal,
    orderType,
    tableNumber,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    clearCart,
  } = useCart();

  const { user: tgUser, triggerHaptic } = useTelegram();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('KHQR'); // Cash, KHQR, ABA QR
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  // Pre-fill name from Telegram SDK if empty
  const defaultName = customerName || `${tgUser?.first_name || ''} ${tgUser?.last_name || ''}`.trim() || 'Guest';

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (paymentMethod === 'KHQR' || paymentMethod === 'ABA QR') {
      setIsQRModalOpen(true);
      return;
    }

    // Submit Cash Order directly
    await processOrderSubmission();
  };

  const processOrderSubmission = async () => {
    setIsSubmitting(true);
    triggerHaptic('medium');

    try {
      const orderPayload = {
        customer_name: defaultName,
        customer_phone: customerPhone || '+855 12 345 678',
        telegram_id: String(tgUser?.id || ''),
        order_type: orderType,
        table_number: tableNumber,
        payment_method: paymentMethod,
        total: grandTotal,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          options: item.options,
          note: item.note,
        })),
      };

      const result = await api.createOrder(orderPayload);
      toast.success('Order placed successfully!');
      clearCart();
      setIsQRModalOpen(false);
      navigate(`/order-success/${result.order_id || 'ORD-999'}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cart')}
          className="p-2.5 rounded-2xl bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Checkout</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confirm details and payment method
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Customer Information */}
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-coffee-600 dark:text-amber-400" />
            Customer Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerName || defaultName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+855 12 345 678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-coffee-600 dark:text-amber-400" />
            Select Payment Method
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'KHQR', label: 'Bakong KHQR', icon: QrCode, tag: 'Instant' },
              { id: 'ABA QR', label: 'ABA Pay', icon: QrCode, tag: 'Popular' },
              { id: 'Cash', label: 'Cash on Counter', icon: Banknote, tag: 'Cash' },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                    isSelected
                      ? 'bg-coffee-600 text-white border-coffee-600 dark:bg-amber-500 dark:text-espresso font-bold shadow-md'
                      : 'border-coffee-200 dark:border-coffee-800 text-slate-700 dark:text-slate-300 hover:bg-coffee-50 dark:hover:bg-espresso'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 uppercase font-bold">
                      {method.tag}
                    </span>
                  </div>
                  <span className="text-xs font-bold">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 flex justify-between items-center">
          <div>
            <span className="text-xs text-slate-500">Order Total ({cartItems.length} items)</span>
            <p className="text-2xl font-black text-slate-900 dark:text-amber-400">
              {formatCurrency(grandTotal)}
            </p>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-4 bg-coffee-600 hover:bg-coffee-700 text-white font-extrabold rounded-2xl shadow-xl shadow-coffee-600/30 flex items-center gap-2 transition active:scale-98"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm Order</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* KHQR / ABA Payment Modal */}
      <KHQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        totalAmount={grandTotal}
        paymentMethod={paymentMethod}
        onConfirmPayment={processOrderSubmission}
      />
    </div>
  );
};
