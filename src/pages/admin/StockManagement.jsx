import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Edit, RefreshCw } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export const StockManagement = () => {
  const { data: stockItems, loading, refetch } = useApi(api.getStock);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [ingredient, setIngredient] = useState('');
  const [qty, setQty] = useState(10);
  const [unit, setUnit] = useState('kg');

  const handleOpenModal = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setIngredient(item.ingredient);
      setQty(item.qty);
      setUnit(item.unit);
    } else {
      setSelectedItem(null);
      setIngredient('');
      setQty(10);
      setUnit('kg');
    }
    setIsModalOpen(true);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    try {
      await api.updateStock({
        id: selectedItem?.id,
        ingredient,
        qty: Number(qty),
        unit,
      });
      toast.success('Stock level updated successfully');
      setIsModalOpen(false);
      refetch();
    } catch (e) {
      toast.error('Failed to update stock');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Stock Inventory</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track raw ingredients, dairy, syrups & cup supplies
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-lg shadow-coffee-600/30 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ingredient</span>
        </button>
      </div>

      {/* Stock Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-coffee-100 dark:border-coffee-800/40 text-slate-400 font-bold uppercase">
                <th className="pb-3">Ingredient</th>
                <th className="pb-3">Quantity On Hand</th>
                <th className="pb-3">Unit</th>
                <th className="pb-3">Stock Alert Level</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 dark:divide-coffee-800/40">
              {(stockItems || []).map((item) => {
                const isLow = Number(item.qty) <= 5;
                return (
                  <tr key={item.id} className="hover:bg-coffee-50/50 dark:hover:bg-espresso/50">
                    <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-coffee-600 dark:text-amber-400" />
                      <span>{item.ingredient}</span>
                    </td>
                    <td className="py-3.5 font-extrabold text-sm">
                      <span className={isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {item.qty}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-semibold">{item.unit}</td>
                    <td className="py-3.5">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="px-3 py-1.5 bg-coffee-100 dark:bg-espresso hover:bg-coffee-200 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Stock Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
              {selectedItem ? 'Adjust Inventory Stock' : 'Add Stock Item'}
            </h3>

            <form onSubmit={handleSaveStock} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ingredient / Supply Name
                </label>
                <input
                  type="text"
                  required
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  placeholder="e.g. Arabica Coffee Beans"
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                  >
                    <option value="kg">kg</option>
                    <option value="L">L (Liters)</option>
                    <option value="cans">cans</option>
                    <option value="bottles">bottles</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-coffee-600/30"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
