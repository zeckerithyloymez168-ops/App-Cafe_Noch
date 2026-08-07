import React, { useState } from 'react';
import { ShoppingBag, Search, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export const OrdersManagement = () => {
  const { data: orders, loading, refetch } = useApi(api.getOrders);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order ${orderId} updated to ${newStatus}. Customer notified!`);
      refetch();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = (orders || []).filter((order) => {
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customer_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Orders Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Process orders, change status & trigger customer Telegram notifications
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="px-4 py-2.5 bg-coffee-100 dark:bg-espresso-light hover:bg-coffee-200 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-coffee-200 dark:border-coffee-800 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="glass-card rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or name..."
            className="w-full pl-10 pr-4 py-2 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === st
                  ? 'bg-coffee-600 text-white font-bold'
                  : 'bg-coffee-50 dark:bg-espresso text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid Cards */}
      {loading ? (
        <TableSkeleton />
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-3xl">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-base">
                      {order.order_id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    Customer: {order.customer_name || 'Guest'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatDate(order.order_date)} • {order.payment_method || 'Cash'}
                  </p>
                </div>

                <span className="text-lg font-black text-coffee-600 dark:text-amber-400">
                  {formatCurrency(order.total)}
                </span>
              </div>

              {/* Items List */}
              <div className="bg-coffee-50/60 dark:bg-espresso/60 rounded-2xl p-3 space-y-1.5 border border-coffee-100 dark:border-coffee-900/40 text-xs">
                {order.items &&
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                      <span>
                        <strong className="text-coffee-600 dark:text-amber-400">{item.qty}x</strong>{' '}
                        {item.menu_name || item.name}
                      </span>
                      <span className="font-semibold">{formatCurrency(item.subtotal || item.price * item.qty)}</span>
                    </div>
                  ))}
              </div>

              {/* Status Selector & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-coffee-100 dark:border-coffee-800/40">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <div className="flex gap-1.5">
                  {['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(order.order_id, st)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition ${
                        order.status === st
                          ? 'bg-coffee-600 text-white shadow-md'
                          : 'bg-coffee-100 dark:bg-espresso text-slate-600 dark:text-slate-400 hover:bg-coffee-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
