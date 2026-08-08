'use client';

import React from 'react';
import { Category } from '@/domain/entities/Category';
import { Utensils, Coffee, Cake, Star } from 'lucide-react';

export interface CategoryFilterItem {
  id: string;
  name: string;
  slug?: string;
}

interface CategoryFilterProps {
  categories: (Category | CategoryFilterItem)[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const getCategoryIcon = (slug?: string) => {
    switch (slug) {
      case 'kitchen':
        return <Utensils className="w-4 h-4" />;
      case 'drinks':
        return <Coffee className="w-4 h-4" />;
      case 'bakery':
        return <Cake className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto py-4 px-3 -mx-3 -my-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('all')}
        className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
          activeCategoryId === 'all'
            ? 'bg-[#D4A373] text-stone-950 shadow-md shadow-[#D4A373]/30 scale-105 ring-2 ring-[#E5B484]/50'
            : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
        }`}
      >
        <Star className="w-4 h-4 fill-current" />
        <span>Всё меню</span>
      </button>

      {categories.map((category) => {
        const isActive = activeCategoryId === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shrink-0 ${
              isActive
                ? 'bg-[#D4A373] text-stone-950 shadow-md shadow-[#D4A373]/30 scale-105 ring-2 ring-[#E5B484]/50'
                : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
            }`}
          >
            {getCategoryIcon(category.slug)}
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};
