'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryFilter } from '@/presentation/components/catalog/CategoryFilter';
import { Package, Tag, Newspaper, Plus, Trash2, Edit, X, ShieldAlert, Search, Clock, Scale } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: string;
  weightVolume?: string;
  prepTime?: number;
  discount?: number;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
}

interface CategoryItem {
  id: string;
  name: string;
  slug?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    title: '',
    description: '',
    price: 350,
    image: '/assets/menu/kitchen/1-6.jpg',
    type: 'DISH',
    weightVolume: '300g',
    prepTime: 15,
    discount: 0,
    isAvailable: true,
    isFeatured: false,
    categoryId: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData);
      setCategories(cData);
      if (cData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: cData[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: formData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          prepTime: formData.prepTime ? Number(formData.prepTime) : undefined,
          price: Number(formData.price),
          discount: formData.discount ? Number(formData.discount) : 0,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Ошибка при сохранении');
      }
    } catch (e) {
      alert('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить эту позицию из меню?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      description: '',
      price: 350,
      image: '/assets/menu/kitchen/1-6.jpg',
      type: 'DISH',
      weightVolume: '300g',
      prepTime: 15,
      discount: 0,
      isAvailable: true,
      isFeatured: false,
      categoryId: categories[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setFormData(p);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-stone-800">
        <div>
          <h1 className="text-2xl font-black text-stone-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#E76F51]" />
            <span>Панель Администратора</span>
          </h1>
          <p className="text-xs text-stone-400">Управление блюдами, ценами, весом и категориями меню</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Package className="w-4 h-4" /> Заказы
          </Link>
          <Link href="/admin/products" className="px-4 py-2 bg-[#D4A373] text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow">
            <Tag className="w-4 h-4" /> Товары и Меню
          </Link>
          <Link href="/admin/news" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Newspaper className="w-4 h-4" /> Новости
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-stone-800">
        <CategoryFilter
          categories={categories}
          activeCategoryId={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по наименованию..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-full text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4A373] transition-all"
          />
        </div>
      </div>

      {/* Header Action */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-bold text-stone-100">
          Каталог блюд ({filteredProducts.length} из {products.length})
        </h2>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Добавить новое блюдо
        </button>
      </div>

      {/* Products Table / List */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 text-xs">Загрузка товаров...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-stone-800 text-stone-400 text-xs">
          Ничего не найдено по выбранному фильтру
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div key={p.id} className="glass-panel p-4 rounded-2xl border border-stone-800 flex flex-col justify-between space-y-4">
              <div className="flex gap-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-stone-100 truncate">{p.title}</h3>
                  <p className="text-xs text-stone-400 line-clamp-2 mt-1">{p.description}</p>
                  
                  {/* Badges for Weight/Volume & PrepTime */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs font-extrabold text-[#D4A373]">{p.price} ₽</span>
                    
                    {p.weightVolume && (
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Scale className="w-3 h-3 text-[#D4A373]" /> {p.weightVolume}
                      </span>
                    )}

                    {p.prepTime && (
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D4A373]" /> ~{p.prepTime} мин
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${p.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-stone-400 text-[11px]">{p.isAvailable ? 'Доступно' : 'Скрыто'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
                    title="Редактировать"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg text-xs"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1C1917] border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 shrink-0">
              <h3 className="text-lg font-bold text-stone-100">
                {formData.id ? 'Редактировать блюдо' : 'Создать новое блюдо'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs overflow-y-auto pr-1">
              <div>
                <label className="block text-stone-300 mb-1.5 font-bold">Название блюда</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="например, Завтрак Вода"
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5 font-bold">Описание</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Состав блюда..."
                  className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Объем / Вес</label>
                  <input
                    type="text"
                    placeholder="например: 300g или 400 мл"
                    value={formData.weightVolume || ''}
                    onChange={(e) => setFormData({ ...formData, weightVolume: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Время готовки (мин)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={formData.prepTime || ''}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Цена (₽)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Тип блюда</label>
                  <select
                    value={formData.type || 'DISH'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-[#D4A373] cursor-pointer"
                  >
                    <option value="DISH">DISH (Кухня)</option>
                    <option value="DRINK">DRINK (Напиток)</option>
                    <option value="BAKERY">BAKERY (Выпечка)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Путь к фото</label>
                  <input
                    type="text"
                    value={formData.image || ''}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets/menu/..."
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1.5 font-bold">Категория</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 focus:outline-none focus:border-[#D4A373] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 border-t border-stone-800/60">
                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable ?? true}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-[#D4A373]"
                  />
                  <span>Доступен в меню</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-stone-300 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-[#D4A373]"
                  />
                  <span>Хит на главной</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 font-extrabold rounded-xl text-xs shadow-lg mt-4 transition-all"
              >
                Сохранить в меню
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
