import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Coffee,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatCard } from '../../components/admin/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DashboardSkeleton } from '../../components/common/LoadingSkeleton';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const REVENUE_DATA = [
  { day: 'Mon', revenue: 140 },
  { day: 'Tue', revenue: 210 },
  { day: 'Wed', revenue: 180 },
  { day: 'Thu', revenue: 290 },
  { day: 'Fri', revenue: 380 },
  { day: 'Sat', revenue: 450 },
  { day: 'Sun', revenue: 420 },
];

const POPULAR_DRINKS = [
  { name: 'Caramel Macchiato', sales: 124 },
  { name: 'Spanish Latte', sales: 98 },
  { name: 'Matcha Frappe', sales: 85 },
  { name: 'Cold Brew Oat', sales: 64 },
  { name: 'Croissant', sales: 52 },
];

export const Dashboard = () => {
  const { data: metrics, loading, refetch } = useApi(api.getDashboardMetrics);
  const navigate = useNavigate();

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      toast.success(`Order ${orderId} updated to ${newStatus}`);
      refetch();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Store Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Real-time coffee shop performance & live orders
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(metrics?.todayRevenue || 185.50)}
          subtext="+14% from yesterday"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Today's Orders"
          value={metrics?.todayOrders || 28}
          subtext="Avg. 4 min prep time"
          icon={ShoppingBag}
          color="coffee"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(metrics?.totalRevenue || 4850.00)}
          subtext="August 2026 Target: 85%"
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Low Stock Alerts"
          value={metrics?.lowStockCount || 3}
          subtext="Action needed in Inventory"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Weekly Revenue Trend ($)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A06B49" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#A06B49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A120B',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#A06B49"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Drinks Bar Chart */}
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Top Selling Coffee Drinks
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POPULAR_DRINKS} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A120B',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="sales" fill="#D97706" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Orders Table */}
      <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recent Incoming Orders
            </h3>
            <p className="text-xs text-slate-500">Live order queue for baristas</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-bold text-coffee-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-coffee-100 dark:border-coffee-800/40 text-slate-400 font-bold uppercase">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 dark:divide-coffee-800/40">
              {(metrics?.latestOrders || []).map((order) => (
                <tr key={order.order_id} className="hover:bg-coffee-50/50 dark:hover:bg-espresso/50">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{order.order_id}</td>
                  <td className="py-3 font-medium">{order.customer_name || 'Guest'}</td>
                  <td className="py-3 text-slate-500">{formatDate(order.order_date)}</td>
                  <td className="py-3 font-semibold">{order.payment_method || 'Cash'}</td>
                  <td className="py-3 font-extrabold text-coffee-600 dark:text-amber-400">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-right">
                    <select
                      value={order.status}
                      onChange={(e) => handleQuickStatusUpdate(order.order_id, e.target.value)}
                      className="px-2 py-1 bg-coffee-100 dark:bg-espresso text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold border border-coffee-200 dark:border-coffee-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
