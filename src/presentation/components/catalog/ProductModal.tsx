'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Clock, Weight, Check } from 'lucide-react';
import { Product } from '@/domain/entities/Product';
import { useCart } from '@/presentation/context/CartContext';

import { getImageUrl } from '@/presentation/utils/imageUtils';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#1C1917] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-stone-900/80 text-stone-300 hover:text-white rounded-full backdrop-blur-sm border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image col */}
          <div className="relative aspect-square md:aspect-auto w-full bg-stone-950">
            <Image
              src={getImageUrl(product.image)}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details col */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-block bg-[#D4A373]/10 text-[#D4A373] text-xs font-semibold px-3 py-1 rounded-full border border-[#D4A373]/20">
                {product.getFormattedBadge()}
              </div>

              <h2 className="text-2xl font-black text-stone-100 leading-tight">
                {product.title}
              </h2>

              <p className="text-sm text-stone-400 leading-relaxed">
                {product.description}
              </p>

              {/* Specs badges */}
              <div className="flex items-center gap-4 text-xs text-stone-400 pt-2 border-t border-stone-800">
                {product.weightVolume && (
                  <div className="flex items-center gap-1.5">
                    <Weight className="w-4 h-4 text-[#D4A373]" />
                    <span>Объем / вес: <strong className="text-stone-200">{product.weightVolume}</strong></span>
                  </div>
                )}
                {product.prepTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#D4A373]" />
                    <span>Время: <strong className="text-stone-200">~{product.prepTime} мин</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Quantity & Action */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs text-stone-500 uppercase tracking-wider font-semibold">Цена</span>
                  <span className="text-2xl font-black text-stone-100">
                    {product.getFinalPrice() * quantity} ₽
                  </span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-stone-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-4 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-emerald-500 text-stone-950'
                    : 'bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 shadow-lg'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Добавлено в корзину!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Добавить {quantity} шт. • {product.getFinalPrice() * quantity} ₽</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
