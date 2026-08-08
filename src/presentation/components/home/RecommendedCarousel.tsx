'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ProductCard } from '@/presentation/components/catalog/ProductCard';
import { ProductModal } from '@/presentation/components/catalog/ProductModal';
import { ProductProps, Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface RecommendedCarouselProps {
  products: ProductProps[];
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({ products }) => {
  // Start in the middle of a large repeated list for infinite movement in both directions
  const REPEAT_COUNT = 40;
  const initialOffset = useMemo(() => Math.floor(REPEAT_COUNT / 2) * products.length, [products.length]);
  
  const [currentIndex, setCurrentIndex] = useState(initialOffset);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isClickLocked = useRef(false);
  const isDragging = useRef(false);

  // Reconstruct domain entities for detail modal
  const domainProducts = useMemo(() => {
    return products.map((p) => ProductFactory.create(p));
  }, [products]);

  // Extended virtual items array for seamless infinite scrolling forward and backward
  const virtualProducts = useMemo(() => {
    if (products.length === 0) return [];
    const list: { item: ProductProps; key: string }[] = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      products.forEach((p, idx) => {
        list.push({ item: p, key: `${p.id}-v${r}-${idx}` });
      });
    }
    return list;
  }, [products]);

  // Throttled step handlers to prevent twitching & offscreen flying on rapid clicks
  const next = () => {
    if (isClickLocked.current) return;
    isClickLocked.current = true;
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => {
      isClickLocked.current = false;
    }, 220);
  };

  const prev = () => {
    if (isClickLocked.current) return;
    isClickLocked.current = true;
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => {
      isClickLocked.current = false;
    }, 220);
  };

  // Card click handler - opens modal ONLY if user didn't drag/swipe
  const handleCardClick = (productProps: ProductProps) => {
    if (isDragging.current) return;
    const found = domainProducts.find((p) => p.id === productProps.id);
    if (found) setSelectedProduct(found);
  };

  return (
    <section className="space-y-6">
      {/* Section Header with Infinite Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D4A373] uppercase tracking-widest mb-1">
            <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
            <span>Специальный выбор</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
            Рекомендуем попробовать
          </h2>
        </div>

        {/* Carousel Arrow Controls & View All Link */}
        <div className="flex items-center gap-4">
          <Link
            href="/menu"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#D4A373] hover:text-[#E5B484] transition-colors mr-2"
          >
            <span>Всё меню ({products.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-3 rounded-full border bg-stone-800 hover:bg-[#D4A373] text-stone-200 hover:text-stone-950 border-stone-700 hover:scale-105 active:scale-95 shadow-md transition-all select-none"
              aria-label="Предыдущее блюдо"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="p-3 rounded-full border bg-stone-800 hover:bg-[#D4A373] text-stone-200 hover:text-stone-950 border-stone-700 hover:scale-105 active:scale-95 shadow-md transition-all select-none"
              aria-label="Следующее блюдо"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Track with Soft Edge Masking & Throttled Deterministic Movement */}
      <div
        className="relative overflow-hidden pt-2 pb-6 -mx-3 px-3"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
        }}
      >
        <motion.div
          animate={{ x: `-${currentIndex * 308}px` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -((virtualProducts.length - 3) * 308), right: 0 }}
          dragElastic={0.05}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={(_, info) => {
            // Convert drag swipe velocity/distance into smooth step changes
            if (info.offset.x < -50) {
              setCurrentIndex((prev) => prev + 1);
            } else if (info.offset.x > 50) {
              setCurrentIndex((prev) => prev - 1);
            }
            setTimeout(() => {
              isDragging.current = false;
            }, 120);
          }}
        >
          {virtualProducts.map((vProduct) => (
            <div
              key={vProduct.key}
              className="w-[280px] sm:w-[300px] shrink-0 select-none"
            >
              <ProductCard
                product={vProduct.item}
                onClickOverride={() => handleCardClick(vProduct.item)}
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Selected Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};
