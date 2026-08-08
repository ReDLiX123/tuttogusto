'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Minus, Eye } from 'lucide-react';
import { Product, ProductProps } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { useCart } from '@/presentation/context/CartContext';
import { ProductModal } from './ProductModal';

import { getImageUrl } from '@/presentation/utils/imageUtils';

interface ProductCardProps {
  product: Product | ProductProps;
  onClickOverride?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product: rawProduct, onClickOverride }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reconstruct Product entity if plain object is passed across RSC boundary
  const product: Product = useMemo(() => {
    if (rawProduct instanceof Product) {
      return rawProduct;
    }
    return ProductFactory.create(rawProduct as any);
  }, [rawProduct]);

  // Find quantity in cart for this product
  const cartItem = cart.items.find((item) => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    if (onClickOverride) {
      onClickOverride();
    } else {
      setIsModalOpen(true);
    }
  };

  const finalPrice = product.getFinalPrice();
  const badgeText = product.getFormattedBadge();

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="h-full glass-card rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer group transition-all relative border border-stone-800"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 shrink-0">
          <Image
            src={getImageUrl(product.image)}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Badge */}
          <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-[#D4A373] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#D4A373]/30">
            {badgeText}
          </div>

          {/* Discount Tag */}
          {product.discount > 0 && (
            <div className="absolute top-3 right-3 bg-[#E76F51] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              -{product.discount}%
            </div>
          )}

          {/* Quick View Hover Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-stone-900/90 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-stone-700">
              <Eye className="w-3.5 h-3.5 text-[#D4A373]" /> Подробнее
            </span>
          </div>
        </div>

        {/* Content with 2-line title container height */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <h3 className="min-h-[2.75rem] text-sm sm:text-base font-bold text-stone-100 group-hover:text-[#D4A373] transition-colors line-clamp-2 leading-tight flex items-center">
              {product.title}
            </h3>
            <p className="h-9 text-xs text-stone-400 line-clamp-2 leading-relaxed font-normal overflow-hidden">
              {product.description}
            </p>
          </div>

          {/* Footer Price & Dynamic Add/Quantity Controller */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-stone-100">{finalPrice} ₽</span>
              {product.discount > 0 && (
                <span className="text-xs text-stone-500 line-through font-medium">
                  {product.price} ₽
                </span>
              )}
            </div>

            {quantityInCart > 0 ? (
              /* Quantity Stepper when item is already in cart */
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center bg-[#D4A373] text-stone-950 rounded-xl p-1 font-extrabold shadow-md border border-[#E5B484] transition-all"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantityInCart - 1);
                  }}
                  className="p-1 hover:bg-stone-950/15 rounded-lg transition-colors text-stone-950"
                  title="Уменьшить"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="text-xs font-black px-2 min-w-[20px] text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, quantityInCart + 1);
                  }}
                  className="p-1 hover:bg-stone-950/15 rounded-lg transition-colors text-stone-950"
                  title="Увеличить"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            ) : (
              /* Standard Add Button when not in cart */
              <button
                onClick={handleAddToCart}
                className="p-2.5 rounded-xl transition-all duration-300 font-semibold flex items-center gap-1.5 text-xs bg-stone-800 hover:bg-[#D4A373] text-stone-200 hover:text-stone-950 border border-stone-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Заказать</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {isModalOpen && (
        <ProductModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
