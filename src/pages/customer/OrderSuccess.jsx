import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Coffee, BellRing, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { api } from '../../services/api';

export const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Poll for order status updates
  useEffect(() => {
    let isMounted = true;
    const fetchOrderDetails = async () => {
      try {
        const orders = await api.getOrders();
        const found = orders.find((o) => o.order_id === orderId);
        if (isMounted) {
          setOrder(found || {
            order_id: orderId,
            customer_name: 'Sokha Meng',
            order_date: new Date().toISOString(),
            total: 10.80,
            payment_method: 'KHQR',
            status: 'Pending',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 5000); // 5 sec poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const currentStatus = order?.status || 'Pending';

  const statusSteps = [
    { id: 'Pending', label: 'Order Received', icon: Clock, desc: 'Sent to barista' },
    { id: 'Preparing', label: 'Brewing Coffee', icon: Coffee, desc: 'Crafting your drinks' },
    { id: 'Ready', label: 'Ready for Pickup', icon: BellRing, desc: 'Hot & fresh!' },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2, desc: 'Enjoy your coffee!' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Success Badge Banner */}
      <div className="glass-card rounded-3xl p-6 text-center border border-coffee-200/50 dark:border-coffee-800/40 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9 animate-bounce-subtle" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Order Confirmed!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Order ID: <code className="font-mono font-bold text-coffee-600 dark:text-amber-400">{orderId}</code>
        </p>
      </div>

      {/* Real-time Order Tracker Pipeline */}
      <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Live Order Status Tracker
        </h3>

        <div className="relative pl-6 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-coffee-200 dark:before:bg-coffee-800">
          {statusSteps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Step Node Icon */}
                <div
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-espresso ring-4 ring-amber-500/20 font-bold scale-110'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-coffee-200 dark:bg-coffee-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="pl-3">
                  <h4
                    className={`text-xs font-extrabold ${
                      isCurrent
                        ? 'text-amber-600 dark:text-amber-400 text-sm'
                        : isDone
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Telegram Notification Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-between shadow-lg shadow-sky-500/20">
        <div className="flex items-center gap-3">
          <Send className="w-6 h-6" />
          <div>
            <h4 className="text-xs font-bold">Get Updates on Telegram</h4>
            <p className="text-[10px] opacity-90">Instant alerts when your coffee is ready</p>
          </div>
        </div>
        <a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 bg-white text-sky-700 font-bold text-xs rounded-xl shadow hover:bg-slate-100 transition"
        >
          Open Bot
        </a>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3.5 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-lg shadow-coffee-600/30 flex items-center justify-center gap-2 transition"
        >
          <Coffee className="w-4 h-4" />
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
