import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';

export const OrderHistory = () => {
  const { data: orders, loading } = useApi(api.getOrders);
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOrders = (orders || []).filter(
    (o) => filterStatus === 'All' || o.status === filterStatus
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Order History</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track and review your past coffee orders
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filterStatus === st
                ? 'bg-coffee-600 dark:bg-amber-500 text-white dark:text-espresso font-bold'
                : 'bg-white dark:bg-espresso-light text-slate-600 dark:text-slate-300 border border-coffee-200 dark:border-coffee-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Order List */}
      {loading ? (
        <TableSkeleton />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Past Orders"
          description="You haven't placed any orders matching this filter."
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.order_id}
              onClick={() => navigate(`/order-success/${order.order_id}`)}
              className="glass-card rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 cursor-pointer hover:border-coffee-400 transition flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {order.order_id}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formatDate(order.order_date)} • {order.payment_method || 'Cash'}
                </p>
                {order.items && (
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
                    {order.items.map((i) => `${i.qty}x ${i.menu_name || i.name}`).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-coffee-600 dark:text-amber-400">
                  {formatCurrency(order.total)}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
