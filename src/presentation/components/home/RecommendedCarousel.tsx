'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ProductCard } from '@/presentation/components/catalog/ProductCard';
import { ProductModal } from '@/presentation/components/catalog/ProductModal';
import { ProductProps, Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface RecommendedCarouselProps {
  products: ProductProps[];
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isClickLocked = useRef(false);
  const isDragging = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1 original set + 1 duplicate repeat copy for seamless infinite looping without DOM clutter
  const REPEAT_COUNT = 2;
  const [currentIndex, setCurrentIndex] = useState(0);

  // MotionValue for unified, smooth Framer Motion dragging & animations on desktop
  const x = useMotionValue(0);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smoothly animate x MotionValue whenever currentIndex changes on desktop
  useEffect(() => {
    if (!isMobile) {
      animate(x, -currentIndex * 308, {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      });
    }
  }, [currentIndex, isMobile, x]);

  // Reconstruct domain entities for detail modal
  const domainProducts = useMemo(() => {
    return products.map((p) => ProductFactory.create(p));
  }, [products]);

  // Compact virtual items array (1 original + 1 duplicate with aria-hidden)
  const virtualProducts = useMemo(() => {
    if (products.length === 0) return [];
    const list: { item: ProductProps; key: string; isDuplicate: boolean }[] = [];
    for (let r = 0; r < REPEAT_COUNT; r++) {
      const isDuplicate = r > 0;
      products.forEach((p, idx) => {
        list.push({ item: p, key: `${p.id}-v${r}-${idx}`, isDuplicate });
      });
    }
    return list;
  }, [products]);

  // Modulo step navigation handlers
  const next = () => {
    if (isClickLocked.current || products.length === 0) return;
    isClickLocked.current = true;

    if (isMobile && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    } else {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }

    setTimeout(() => {
      isClickLocked.current = false;
    }, 220);
  };

  const prev = () => {
    if (isClickLocked.current || products.length === 0) return;
    isClickLocked.current = true;

    if (isMobile && scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    } else {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    }

    setTimeout(() => {
      isClickLocked.current = false;
    }, 220);
  };

  // Open product detail modal
  const handleCardClick = (productProps: ProductProps) => {
    if (isDragging.current) return;
    const found = domainProducts.find((p) => p.id === productProps.id);
    if (found) setSelectedProduct(found);
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Section Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D4A373] uppercase tracking-widest mb-1">
            <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
            <span>Специальный выбор</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-stone-100">
            Рекомендуем попробовать
          </h2>
        </div>

        {/* Carousel Arrow Controls & View All Link */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D4A373] hover:text-[#E5B484] transition-colors"
          >
            <span className="hidden sm:inline">Всё меню ({products.length}+)</span>
            <span className="sm:hidden">Меню</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={prev}
              className="p-2 sm:p-3 rounded-full border bg-stone-800 hover:bg-[#D4A373] text-stone-200 hover:text-stone-950 border-stone-700 hover:scale-105 active:scale-95 shadow-md transition-all select-none"
              aria-label="Предыдущее блюдо"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={next}
              className="p-2 sm:p-3 rounded-full border bg-stone-800 hover:bg-[#D4A373] text-stone-200 hover:text-stone-950 border-stone-700 hover:scale-105 active:scale-95 shadow-md transition-all select-none"
              aria-label="Следующее блюдо"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        Mobile View: Render ONLY original products in touch snap container
        Desktop View: Render 1 original + 1 duplicate (aria-hidden) set for smooth loop
      */}
      {isMobile ? (
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 -mx-4 px-4 scroll-smooth"
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="w-[82vw] max-w-[290px] shrink-0 snap-center select-none"
            >
              <ProductCard
                product={item}
                onClickOverride={() => handleCardClick(item)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="relative overflow-hidden pt-2 pb-6 -mx-3 px-3"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
            maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
          }}
        >
          <motion.div
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -((virtualProducts.length - 3) * 308), right: 0 }}
            dragElastic={0.05}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragEnd={(_, info) => {
              const threshold = 40;
              if (info.offset.x < -threshold) {
                next();
              } else if (info.offset.x > threshold) {
                prev();
              } else {
                animate(x, -currentIndex * 308, {
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                });
              }
              setTimeout(() => {
                isDragging.current = false;
              }, 120);
            }}
            className="flex gap-6 cursor-grab active:cursor-grabbing"
          >
            {virtualProducts.map((vProduct) => (
              <div
                key={vProduct.key}
                className="w-[280px] sm:w-[300px] shrink-0 select-none"
                aria-hidden={vProduct.isDuplicate ? 'true' : undefined}
              >
                <ProductCard
                  product={vProduct.item}
                  onClickOverride={() => handleCardClick(vProduct.item)}
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}

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
