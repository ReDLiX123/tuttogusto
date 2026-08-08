'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryFilter } from '@/presentation/components/catalog/CategoryFilter';
import { ProductCard } from '@/presentation/components/catalog/ProductCard';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { Product } from '@/domain/entities/Product';
import { Category } from '@/domain/entities/Category';
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from '@/domain/staticData';
import { Search, Loader2, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories').catch(() => null),
          fetch('/api/products').catch(() => null),
        ]);

        if (catRes && prodRes && catRes.ok && prodRes.ok) {
          const catData = await catRes.json();
          const prodData = await prodRes.json();
          setCategories(catData.map((c: any) => new Category(c)));
          setProducts(prodData.map((p: any) => ProductFactory.create(p)));
        } else {
          // Static export fallback for GitHub Pages
          setCategories(STATIC_CATEGORIES.map((c: any) => new Category(c)));
          setProducts(STATIC_PRODUCTS.map((p: any) => ProductFactory.create(p)));
        }
      } catch (err) {
        setCategories(STATIC_CATEGORIES.map((c: any) => new Category(c)));
        setProducts(STATIC_PRODUCTS.map((p: any) => ProductFactory.create(p)));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Reset to page 1 whenever category or search filter changes
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smoothly scroll up to the menu section
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-100">
          Меню & Каталог блюд
        </h1>
        <p className="text-sm text-stone-400 max-w-2xl">
          Выберите любимый авторский кофе, сытные горячие блюда кухни или свежевыпеченные круассаны с доставкой по Иркутску.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-stone-800">
        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategory}
          onSelectCategory={handleCategoryChange}
        />

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Поиск по названию или составу..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-full text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4A373] transition-all"
          />
        </div>
      </div>

      {/* Products Grid with Animated Page Transitions */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-stone-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4A373]" />
          <p className="text-sm font-medium">Загружаем меню «Туттогусто»...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 glass-panel rounded-2xl border border-stone-800 space-y-3"
        >
          <UtensilsCrossed className="w-12 h-12 mx-auto text-stone-600" />
          <h3 className="text-lg font-bold text-stone-200">Блюда не найдены</h3>
          <p className="text-xs text-stone-500">Попробуйте изменить категорию или поисковый запрос</p>
        </motion.div>
      ) : (
        <div className="space-y-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${searchQuery}-${currentPage}`}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {paginatedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(idx * 0.04, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Styled Animated Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-800/80">
              <span className="text-xs text-stone-400 font-medium">
                Показано <strong className="text-stone-200">{startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</strong> из <strong className="text-stone-200">{filteredProducts.length}</strong> блюд
              </span>

              <div className="flex items-center gap-2">
                {/* Previous Page Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2.5 rounded-full border transition-all ${
                    currentPage === 1
                      ? 'bg-stone-900/40 text-stone-600 border-stone-800/50 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-[#D4A373] text-stone-300 hover:text-stone-950 border-stone-700 shadow-md'
                  }`}
                  aria-label="Предыдущая страница"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1.5 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-full text-xs font-black transition-all flex items-center justify-center ${
                        currentPage === page
                          ? 'bg-[#D4A373] text-stone-950 shadow-lg shadow-[#D4A373]/20 ring-2 ring-[#E5B484]/40'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                {/* Next Page Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2.5 rounded-full border transition-all ${
                    currentPage === totalPages
                      ? 'bg-stone-900/40 text-stone-600 border-stone-800/50 cursor-not-allowed'
                      : 'bg-stone-800 hover:bg-[#D4A373] text-stone-300 hover:text-stone-950 border-stone-700 shadow-md'
                  }`}
                  aria-label="Следующая страница"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
