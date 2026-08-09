'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { getImageUrl } from '@/presentation/utils/imageUtils';

const SLIDES = [
  {
    id: 1,
    title: 'Атмосфера вкуса & Авторский кофе',
    subtitle: 'Кофейня премиум-класса «Туттогусто» • Хрустальный парк',
    description: 'Готовим из свежеобжаренных зерен спешелти сегмента и подаем изысканные блюда шеф-повара прямо из печи.',
    image: getImageUrl('/assets/menu/slider/slide-2.jpg'),
    ctaText: 'Перейти в меню',
    ctaLink: '/menu',
  },
  {
    id: 2,
    title: 'Завтраки & Свежая выпечка каждый день',
    subtitle: 'Ручная работа наших кондитеров с 07:15',
    description: 'Хрустящие миндальные круассаны, баскские чизкейки и бриоши с лососем и яйцами пашот.',
    image: getImageUrl('/assets/menu/slider/slide-3.jpg'),
    ctaText: 'Выбрать выпечку',
    ctaLink: '/menu?category=bakery',
  },
  {
    id: 3,
    title: 'Быстрый предзаказ без очереди',
    subtitle: 'Приготовим к вашему приходу с 07:15',
    description: 'Оформите заказ на сайте — бариста приготовит ваш любимый кофе и блюда точно к вашему визиту в кофейню.',
    image: getImageUrl('/assets/menu/slider/slide-4.jpg'),
    ctaText: 'Сделать предзаказ',
    ctaLink: '/menu',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLockedRef = useRef(false);

  // Restart 6-second auto-slide countdown on manual action to avoid double jumping
  const resetAutoSlideTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
  };

  useEffect(() => {
    resetAutoSlideTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleManualNext = () => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setCurrent((prev) => (prev + 1) % SLIDES.length);
    resetAutoSlideTimer();
    setTimeout(() => {
      isLockedRef.current = false;
    }, 400);
  };

  const handleManualPrev = () => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    resetAutoSlideTimer();
    setTimeout(() => {
      isLockedRef.current = false;
    }, 400);
  };

  const handleDotClick = (idx: number) => {
    if (isLockedRef.current || idx === current) return;
    isLockedRef.current = true;
    setCurrent(idx);
    resetAutoSlideTimer();
    setTimeout(() => {
      isLockedRef.current = false;
    }, 400);
  };

  return (
    <section className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-stone-950 border border-stone-800 touch-pan-y">
      {/* Simultaneous smooth crossfade transition with mobile touch swipe support */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -30) {
              handleManualNext();
            } else if (info.offset.x > 30) {
              handleManualPrev();
            }
          }}
          className="absolute inset-0 w-full h-full select-none"
        >
          {/* Background Image */}
          <Image
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            fill
            className="object-cover pointer-events-none"
            priority
          />
          {/* Lighter, softer overlay gradient for brighter food photos */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

          {/* Slide Content */}
          <div className="relative z-10 h-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col justify-center space-y-6">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-[#D4A373]/25 border border-[#D4A373]/40 text-[#D4A373] text-xs font-bold px-3.5 py-1.5 rounded-full w-fit backdrop-blur-md shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
              <span>{SLIDES[current].subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-3xl md:text-5xl font-black text-stone-100 tracking-tight leading-none drop-shadow-md"
            >
              {SLIDES[current].title}
            </motion.h1>

            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm md:text-base text-stone-200 max-w-xl leading-relaxed drop-shadow-sm font-medium"
            >
              {SLIDES[current].description}
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
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

      {/* Navigation Arrows (Hidden on mobile <640px to prevent text obstruction, visible on tablet & desktop) */}
      <button
        onClick={handleManualPrev}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-stone-900/60 hover:bg-stone-900 text-stone-200 rounded-full backdrop-blur-sm border border-stone-800 transition-all hover:scale-110 active:scale-95 shadow-lg select-none"
        aria-label="Предыдущий слайд"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleManualNext}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-stone-900/60 hover:bg-stone-900 text-stone-200 rounded-full backdrop-blur-sm border border-stone-800 transition-all hover:scale-110 active:scale-95 shadow-lg select-none"
        aria-label="Следующий слайд"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              current === idx ? 'bg-[#D4A373] w-8' : 'bg-stone-600/70 hover:bg-stone-400 w-3'
            }`}
            aria-label={`Перейти к слайду ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
