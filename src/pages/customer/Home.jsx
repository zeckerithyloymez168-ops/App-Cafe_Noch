import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Coffee } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { api } from '../../services/api';
import { ProductCard } from '../../components/customer/ProductCard';
import { CategoryTabs } from '../../components/customer/CategoryTabs';
import { ProductSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductDetailModal } from './ProductDetail';

export const Home = () => {
  const { data: menuItems, loading, error } = useApi(api.getMenu);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = useMemo(() => {
    if (!menuItems) return ['All'];
    const cats = Array.from(new Set(menuItems.map((item) => item.category)));
    return ['All', ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-coffee-800 via-coffee-700 to-coffee-900 p-6 sm:p-10 text-white shadow-xl shadow-coffee-900/20 border border-coffee-700/50">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 backdrop-blur-md text-amber-300 rounded-full text-xs font-bold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Handcrafted Artisanal Coffee</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
            Fuel Your Day with Premium Brews
          </h2>
          <p className="text-sm text-coffee-100/80 mb-6 line-clamp-2">
            Freshly roasted beans, specialty espresso drinks, and gourmet pastries delivered right to your table.
          </p>

          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search caramel macchiato, croissant..."
              className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-espresso-dark/90 backdrop-blur-md text-slate-900 dark:text-white rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-1">
          Explore Menu
        </h3>
        <CategoryTabs
          categories={categories}
          activeCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Coffee}
          title="No Products Found"
          description={`No items match your search "${searchQuery}". Try searching for another drink or category.`}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={(prod) => setSelectedProduct(prod)}
            />
          ))}
        </div>
      )}

      {/* Product Detail Customization Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
