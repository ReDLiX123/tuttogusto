'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { getImageUrl } from '@/presentation/utils/imageUtils';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
  isPublished: boolean;
  createdAt: string;
}

interface NewsSectionProps {
  initialNews: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ initialNews }) => {
  const [newsList, setNewsList] = useState<NewsItem[]>(initialNews);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(data);
        }
      })
      .catch(() => {});
  }, []);

  if (!newsList || newsList.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#E76F51]" />
          <span>Акции & События в кофейне</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="glass-panel rounded-2xl overflow-hidden border border-stone-800/90 flex flex-col group hover:border-[#D4A373]/40 transition-all duration-300 shadow-md"
          >
            <div className="relative h-48 w-full bg-stone-900 overflow-hidden">
              <Image
                src={getImageUrl(news.image)}
                alt={news.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-100 group-hover:text-[#D4A373] transition-colors leading-snug">
                  {news.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-normal">
                  {news.content}
                </p>
              </div>
              <span className="text-[11px] text-stone-500 font-semibold block pt-2 border-t border-stone-800/80">
                {new Date(news.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
