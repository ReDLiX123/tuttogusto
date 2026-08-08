import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeroSlider } from '@/presentation/components/home/HeroSlider';
import { RecommendedCarousel } from '@/presentation/components/home/RecommendedCarousel';
import { productService, newsService } from '@/application/container';
import { STATIC_PRODUCTS, STATIC_NEWS } from '@/domain/staticData';
import { Flame, Clock, ShieldCheck, Heart } from 'lucide-react';

export const revalidate = 0; // Dynamic server fetching

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let newsList: any[] = [];

  try {
    const featuredDomain = await productService.getFeaturedProducts();
    const newsDomain = await newsService.getPublishedNews();
    featuredProducts = featuredDomain.map((p) => p.toPlainObject());
    newsList = newsDomain.map((n) => n.toPlainObject());
  } catch (e) {
    // Static fallback for GitHub Pages export
    featuredProducts = STATIC_PRODUCTS.filter((p) => p.isFeatured).map((p) => ({
      ...p,
      finalPrice: p.price,
      badgeText: p.type === 'DISH' ? (p.prepTime ? `Готовка ~${p.prepTime} мин` : 'Свежее') : (p.weightVolume || 'Порция'),
    }));
    newsList = STATIC_NEWS;
  }

  if (featuredProducts.length === 0) {
    featuredProducts = STATIC_PRODUCTS.filter((p) => p.isFeatured).map((p) => ({
      ...p,
      finalPrice: p.price,
      badgeText: p.type === 'DISH' ? (p.prepTime ? `Готовка ~${p.prepTime} мин` : 'Свежее') : (p.weightVolume || 'Порция'),
    }));
  }

  if (newsList.length === 0) {
    newsList = STATIC_NEWS;
  }

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Slideshow */}
      <HeroSlider />

      {/* 2. Features Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-stone-800">
          <div className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-100">Свежее каждое утро</h4>
            <p className="text-xs text-stone-400">Выпекаем круассаны с 07:15 и режем салаты прямо перед доставкой</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-stone-800">
          <div className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-100">Доставка за 30-45 мин</h4>
            <p className="text-xs text-stone-400">Собственные курьеры привезут еду горячей по Иркутску</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-stone-800">
          <div className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-100">Спешелти зёрна</h4>
            <p className="text-xs text-stone-400">100% арабика свежей обжарки от лучшего ростера</p>
          </div>
        </div>
      </section>

      {/* 3. Recommended Dishes Manual Interactive Carousel */}
      <RecommendedCarousel products={featuredProducts} />

      {/* 4. News & Promotions Banner Carousel */}
      {newsList.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E76F51]" />
              <span>Акции & События в кофейне</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsList.map((news) => (
              <div
                key={news.id}
                className="glass-panel rounded-2xl overflow-hidden border border-stone-800 flex flex-col group hover:border-[#D4A373]/40 transition-all"
              >
                <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-100 group-hover:text-[#D4A373] transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                      {news.content}
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-500 font-semibold block pt-2 border-t border-stone-800">
                    {new Date(news.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Atmosphere CTA */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-[#D4A373]/30 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <span className="text-xs font-black text-[#D4A373] uppercase tracking-widest">
            Ждем вас в гости
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
            Уютное место для встреч, работы и вдохновения
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Мы находимся по адресу: <strong className="text-stone-100">д. Новолисиха, м-н Хрустальный парк, ул. Кленовая, 15/3</strong>. Заходите за свежим капучино по дороге на работу или заказывайте доставку прямо домой!
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="bg-[#D4A373] hover:bg-[#E5B484] text-stone-950 px-6 py-3 rounded-full text-xs font-extrabold transition-all"
            >
              Заказать доставку
            </Link>
            <a
              href="tel:+79832496019"
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-6 py-3 rounded-full text-xs font-bold transition-all border border-stone-700"
            >
              Позвонить: +7 (983) 249-60-19
            </a>
          </div>
        </div>
        <div className="relative w-full md:w-80 h-52 rounded-2xl overflow-hidden border-2 border-[#D4A373]/30 shrink-0">
          <Image
            src="/assets/menu/pic-1.jpg"
            alt="Атмосфера Туттогусто"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </div>
  );
}
