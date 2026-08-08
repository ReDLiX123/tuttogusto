'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '@/presentation/context/CartContext';
import { pricingService } from '@/application/container';

export const CartDrawer: React.FC = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.getTotalAmount();
  const deliveryFee = pricingService.calculateDeliveryFee(subtotal);
  const total = pricingService.calculateTotal(cart);
  const remainingForFreeDelivery = pricingService.getFreeDeliveryRemaining(subtotal);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#1C1917] border-l border-stone-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#D4A373]" />
                <h2 className="text-lg font-bold text-stone-100 uppercase tracking-wide">
                  Ваша корзина
                </h2>
                <span className="text-xs bg-stone-800 text-[#D4A373] px-2 py-0.5 rounded-full font-bold">
                  {cart.getTotalItemsCount()}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="bg-stone-900/90 p-3 px-5 border-b border-stone-800/60">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <Truck className="w-4 h-4 text-[#D4A373]" />
                {remainingForFreeDelivery > 0 ? (
                  <span>
                    Добавьте блюд на <strong className="text-[#D4A373]">{remainingForFreeDelivery} ₽</strong> для <strong className="text-emerald-400">бесплатной доставки</strong>!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    🎉 У вас бесплатная доставка по Иркутску!
                  </span>
                )}
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#D4A373] to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / 1500) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.items.length === 0 ? (
                <div className="text-center py-16 text-stone-500 space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-stone-700 stroke-1" />
                  <p className="text-base font-medium">Ваша корзина пока пуста</p>
                  <p className="text-xs text-stone-600">Выберите вкусные блюда в нашем меню</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-stone-900/60 p-3 rounded-xl border border-stone-800/80 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-800">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-stone-200 truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-xs text-[#D4A373] font-bold mt-0.5">
                        {item.product.getFinalPrice()} ₽
                      </p>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-white text-stone-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 text-stone-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-white text-stone-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between self-stretch">
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-stone-300">
                        {item.getSubtotal()} ₽
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.items.length > 0 && (
              <div className="p-5 border-t border-stone-800 bg-stone-900/90 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-400">
                  <div className="flex justify-between">
                    <span>Подытог:</span>
                    <span>{subtotal} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                    <span>Итого к оплате:</span>
                    <span className="text-[#D4A373] text-lg">{total} ₽</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-center bg-stone-800 hover:bg-stone-700 text-stone-200 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    В корзину
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Оформить</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
