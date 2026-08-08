'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/tuttogusto' : '';

const SLIDES = [
  {
    id: 1,
    title: 'Атмосфера вкуса & Авторский кофе',
    subtitle: 'Кофейня премиум-класса «Туттогусто» • Хрустальный парк',
    description: 'Готовим из свежеобжаренных зерен спешелти сегмента и подаем изысканные блюда шеф-повара прямо из печи.',
    image: `${BASE_PATH}/assets/menu/slider/slide-2.jpg`,
    ctaText: 'Перейти в меню',
    ctaLink: '/menu',
  },
  {
    id: 2,
    title: 'Завтраки & Свежая выпечка каждый день',
    subtitle: 'Ручная работа наших кондитеров с 07:15',
    description: 'Хрустящие миндальные круассаны, баскские чизкейки и бриоши с лососем и яйцами пашот.',
    image: `${BASE_PATH}/assets/menu/slider/slide-3.jpg`,
    ctaText: 'Выбрать выпечку',
    ctaLink: '/menu?category=bakery',
  },
  {
    id: 3,
    title: 'Быстрая доставка по Иркутску',
    subtitle: 'Привезём горячим за 30-45 минут',
    description: 'Собственная служба доставки аккуратно привезет ваши любимые блюда и напитки по Иркутску.',
    image: `${BASE_PATH}/assets/menu/slider/slide-4.jpg`,
    ctaText: 'Оформить заказ',
    ctaLink: '/menu',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-stone-950 border border-stone-800">
      {/* Simultaneous smooth crossfade transition (no mode="wait" gap) */}
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            fill
            className="object-cover"
            priority
          />
          {/* Lighter, softer overlay gradient for brighter food photos */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />

          {/* Slide Content */}
          <div className="relative z-10 h-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#D4A373]/25 border border-[#D4A373]/40 text-[#D4A373] text-xs font-bold px-3.5 py-1.5 rounded-full w-fit backdrop-blur-md shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
              <span>{SLIDES[current].subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="text-3xl md:text-5xl font-black text-stone-100 tracking-tight leading-none drop-shadow-md"
            >
              {SLIDES[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-sm md:text-base text-stone-200 max-w-xl leading-relaxed drop-shadow-sm font-medium"
            >
              {SLIDES[current].description}
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="pt-2"
            >
              <Link
                href={SLIDES[current].ctaLink}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 px-7 py-3.5 rounded-full font-extrabold text-sm shadow-xl transition-all transform hover:scale-105"
              >
                <span>{SLIDES[current].ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-stone-900/60 hover:bg-stone-900 text-stone-200 rounded-full backdrop-blur-sm border border-stone-800 transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-stone-900/60 hover:bg-stone-900 text-stone-200 rounded-full backdrop-blur-sm border border-stone-800 transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === idx ? 'bg-[#D4A373] w-8' : 'bg-stone-600/70 hover:bg-stone-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
