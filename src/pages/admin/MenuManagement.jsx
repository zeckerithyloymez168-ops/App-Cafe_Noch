import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Coffee, Image, Check, X } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import toast from 'react-hot-toast';

export const MenuManagement = () => {
  const { data: menuItems, loading, refetch } = useApi(api.getMenu);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Espresso',
    price: '',
    description: '',
    image: '',
    stock: 50,
    status: 'Active',
  });

  const categories = ['All', 'Espresso', 'Cold Brew', 'Frappe', 'Tea & Non-Coffee', 'Pastry', 'Food'];

  const filteredItems = (menuItems || []).filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Espresso',
      price: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600',
      stock: 50,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image,
      stock: item.stock,
      status: item.status || 'Active',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateMenuItem({ id: editingItem.id, ...formData, price: Number(formData.price) });
        toast.success('Product updated successfully');
      } else {
        await api.addMenuItem({ ...formData, price: Number(formData.price) });
        toast.success('New product added to menu');
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingId) return;
    try {
      await api.deleteMenuItem(deletingId);
      toast.success('Product deleted');
      setDeletingId(null);
      refetch();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Menu Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, update, and manage your coffee & food items
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-coffee-600 hover:bg-coffee-700 text-white font-bold rounded-2xl shadow-lg shadow-coffee-600/30 flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Drink/Food</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-coffee-200/50 dark:border-coffee-800/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu item..."
            className="w-full pl-10 pr-4 py-2 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-coffee-600 text-white font-bold'
                  : 'bg-coffee-50 dark:bg-espresso text-slate-600 dark:text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table */}
      {loading ? (
        <TableSkeleton />
      ) : (
        <div className="glass-card rounded-3xl p-5 border border-coffee-200/50 dark:border-coffee-800/40 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-coffee-100 dark:border-coffee-800/40 text-slate-400 font-bold uppercase">
                <th className="pb-3">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 dark:divide-coffee-800/40">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-coffee-50/50 dark:hover:bg-espresso/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl object-cover bg-coffee-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold">{item.category}</td>
                  <td className="py-3 font-extrabold text-coffee-600 dark:text-amber-400">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 font-semibold">
                    <span className={item.stock <= 5 ? 'text-rose-600 font-bold' : ''}>
                      {item.stock} units
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {item.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white dark:bg-espresso-light border border-coffee-200 dark:border-coffee-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4">
              {editingItem ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Spanish Latte"
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3.50"
                    className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of taste and ingredients..."
                  className="w-full px-3.5 py-2.5 bg-coffee-50 dark:bg-espresso text-slate-900 dark:text-white rounded-xl text-xs border border-coffee-200 dark:border-coffee-800"
                />
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Menu Product"
        message="Are you sure you want to remove this item from the active coffee menu?"
        confirmText="Delete Product"
      />
    </div>
  );
};
