'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Tag, Newspaper, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('/assets/menu/slider/slide-2.jpg');

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/news');
      const data = await res.json();
      if (Array.isArray(data)) setNews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, image, isPublished: true }),
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        fetchNews();
      }
    } catch (e) {
      alert('Ошибка при создании новости');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchNews();
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-stone-800">
        <div>
          <h1 className="text-2xl font-black text-stone-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#E76F51]" />
            <span>Панель Администратора</span>
          </h1>
          <p className="text-xs text-stone-400">Управление новостями и анонсами акций</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Package className="w-4 h-4" /> Заказы
          </Link>
          <Link href="/admin/products" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Tag className="w-4 h-4" /> Товары и Меню
          </Link>
          <Link href="/admin/news" className="px-4 py-2 bg-[#D4A373] text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow">
            <Newspaper className="w-4 h-4" /> Новости
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <form onSubmit={handleCreate} className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-4 h-fit">
          <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#D4A373]" />
            <span>Опубликовать новость</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Заголовок новости</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Завтраки весь день..."
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Текст анонса</label>
              <textarea
                rows={3}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Подробности акции..."
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-semibold">Путь к обложке (/assets/...)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D4A373] text-stone-950 font-extrabold rounded-xl text-xs shadow-lg"
            >
              Опубликовать
            </button>
          </div>
        </form>

        {/* News list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-stone-100">Опубликованные новости ({news.length})</h2>

          {loading ? (
            <div className="text-center py-16 text-stone-400 text-xs">Загрузка новостей...</div>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="glass-panel p-4 rounded-2xl border border-stone-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-900">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-100">{item.title}</h3>
                      <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">{item.content}</p>
                      <span className="text-[10px] text-stone-500 font-mono mt-1 block">
                        {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-stone-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
