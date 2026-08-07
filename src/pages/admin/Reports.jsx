import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Plus, DollarSign, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportService } from '../../services/exportService';
import toast from 'react-hot-toast';

export const Reports = () => {
  const { data: orders } = useApi(api.getOrders);
  const { data: expenses, refetch: refetchExpenses } = useApi(api.getExpenses);

  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalExpenses = (expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await api.addExpense({
        title: expenseTitle,
        amount: Number(expenseAmount),
      });
      toast.success('Operational expense recorded');
      setExpenseTitle('');
      setExpenseAmount('');
      setIsExpenseModalOpen(false);
      refetchExpenses();
    } catch (err) {
      toast.error('Failed to log expense');
    }
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = (orders || []).map((o) => ({
        'Order ID': o.order_id,
        Customer: o.customer_name || 'Guest',
        Date: formatDate(o.order_date),
        Payment: o.payment_method || 'Cash',
        Status: o.status,
        Total: o.total,
      }));
      exportService.exportToExcel(dataToExport, 'Sales_Report_Cafe_Artisanal.xlsx', 'Sales');
      toast.success('Sales report exported to Excel!');
    } catch (e) {
      toast.error('Excel export failed');
    }
  };

  const handleExportPDF = () => {
    try {
      exportService.exportOrdersPDF(orders || [], 'Coffee Shop Sales Report');
      toast.success('Sales PDF generated!');
    } catch (e) {
      toast.error('PDF export failed');
    }
  };

  const handleExportPnLPDF = () => {
    try {
      exportService.exportProfitLossPDF(orders || [], expenses || []);
      toast.success('Profit & Loss Statement generated!');
    } catch (e) {
      toast.error('P&L Export failed');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Reports & Profit & Loss</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Financial analytics, expense logs & export options
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-2xl shadow flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4" />
            <span>Export Sales PDF</span>
          </button>

          <button
            onClick={handleExportPnLPDF}
            className="px-4 py-2.5 bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs rounded-2xl shadow flex items-center gap-1.5 transition"
          >
            <Receipt className="w-4 h-4" />
            <span>Export P&L Statement</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40">
          <p className="text-xs font-bold text-slate-500 uppercase">Gross Sales Revenue</p>
          <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalRevenue)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Total revenue from coffee orders</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40">
          <p className="text-xs font-bold text-slate-500 uppercase">Operating Expenses</p>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {formatCurrency(totalExpenses)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Beans, milk, utilities & packaging</p>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40">
          <p className="text-xs font-bold text-slate-500 uppercase">Net Profit</p>
          <h3 className="text-2xl font-black text-coffee-600 dark:text-amber-400 mt-1">
            {formatCurrency(netProfit)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Gross Revenue minus Expenses</p>
        </div>
      </div>

      {/* Expense Log Table */}
      <div className="glass-card rounded-3xl p-6 border border-coffee-200/50 dark:border-coffee-800/40 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Operational Expense Log
            </h3>
            <p className="text-xs text-slate-500">Recorded shop operational costs</p>
          </div>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-2 bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-coffee-100 dark:border-coffee-800/40 text-slate-400 font-bold uppercase">
                <th className="pb-3">Expense ID</th>
                <th className="pb-3">Title / Description</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 dark:divide-coffee-800/40">
              {(expenses || []).map((exp) => (
                <tr key={exp.id} className="hover:bg-coffee-50/50 dark:hover:bg-espresso/50">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{exp.id}</td>
                  <td className="py-3 font-semibold">{exp.title}</td>
                  <td className="py-3 text-slate-500">{exp.date || 'N/A'}</td>
                  <td className="py-3 font-extrabold text-rose-600 dark:text-rose-400 text-right">
                    {formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
              Log Shop Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Expense Title
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. 50kg Coffee Beans Delivery"
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="120.00"
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-coffee-600/30"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
