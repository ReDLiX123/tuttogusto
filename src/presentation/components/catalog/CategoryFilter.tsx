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
    <div className="w-full">
      {/* 
        Responsive layout: 
        - On mobile (<640px): 2-column grid or wrapping pills so ALL categories 
          ("Всё меню", "Кухня", "Авторский кофе", "Свежая выпечка") are 100% visible at once without cutoffs.
        - On tablet & desktop (>=640px): Horizontal flex pills row.
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center gap-2 sm:gap-2.5 w-full">
        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full lg:w-auto px-4 py-2.5 rounded-xl sm:rounded-full text-xs font-extrabold transition-all flex items-center justify-center sm:justify-start gap-2 select-none min-h-[42px] ${
            activeCategoryId === 'all'
              ? 'bg-[#D4A373] text-stone-950 shadow-md shadow-[#D4A373]/30 ring-2 ring-[#E5B484]/50'
              : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
          }`}
        >
          <Star className="w-4 h-4 fill-current shrink-0" />
          <span>Всё меню</span>
        </button>

        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full lg:w-auto px-4 py-2.5 rounded-xl sm:rounded-full text-xs font-extrabold transition-all flex items-center justify-center sm:justify-start gap-2 select-none min-h-[42px] text-center ${
                isActive
                  ? 'bg-[#D4A373] text-stone-950 shadow-md shadow-[#D4A373]/30 ring-2 ring-[#E5B484]/50'
                  : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span className="shrink-0">{getCategoryIcon(category.slug)}</span>
              <span className="truncate">{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
