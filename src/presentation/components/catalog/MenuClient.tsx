'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryFilter } from '@/presentation/components/catalog/CategoryFilter';
import { ProductCard } from '@/presentation/components/catalog/ProductCard';
import { ProductProps } from '@/domain/entities/Product';
import { Search, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';
import { SchemaOrg } from '@/presentation/components/seo/SchemaOrg';

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
}

interface MenuClientProps {
  initialCategories: CategoryItem[];
  initialProducts: (ProductProps & { finalPrice?: number; badgeText?: string })[];
}

const ITEMS_PER_PAGE = 8;

export const MenuClient: React.FC<MenuClientProps> = ({
  initialCategories,
  initialProducts,
}) => {
  const [categories] = useState<CategoryItem[]>(initialCategories);
  const [products, setProducts] = useState<typeof initialProducts>(initialProducts);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  React.useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});
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
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 py-6">
      <SchemaOrg products={products} categories={categories} />

      {/* Page Header */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-stone-100">
          Меню & Каталог блюд
        </h1>
        <p className="text-sm text-stone-400 max-w-2xl">
          Выберите любимый авторский кофе, сытные горячие блюда или свежевыпеченные круассаны. Оформите быстрый предзаказ и заберите готовым без очереди в кофейне!
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-2xl border border-stone-800 w-full overflow-hidden">
        <div className="flex-1 min-w-0">
          <CategoryFilter
            categories={categories}
            activeCategoryId={activeCategory}
            onSelectCategory={handleCategoryChange}
          />
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-auto lg:min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Поиск по названию или составу..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-full text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4A373] transition-all"
            aria-label="Поиск по меню"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
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
};
