'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/presentation/context/CartContext';
import { pricingService } from '@/application/container';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag, Check } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = pricingService.calculateSubtotal(cart);
  const deliveryFee = pricingService.calculateDeliveryFee(subtotal);
  const total = pricingService.calculateTotal(cart, promoDiscount);
  const remainingForFreeDelivery = pricingService.getFreeDeliveryRemaining(subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'tutto10') {
      setPromoDiscount(10);
      setPromoApplied(true);
    } else {
      alert('Неверный промокод! Попробуйте TUTTO10 для скидки 10%');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="py-20 text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mx-auto border border-stone-800">
          <ShoppingBag className="w-10 h-10 text-stone-600 stroke-1" />
        </div>
        <h1 className="text-2xl font-black text-stone-100">Ваша корзина пуста</h1>
        <p className="text-sm text-stone-400">
          Вы еще ничего не добавили. Перейдите в наше меню и выберите вкуснейшие авторские блюда и кофе!
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-[#D4A373] hover:bg-[#E5B484] text-stone-950 px-8 py-3.5 rounded-full font-black text-sm shadow-xl transition-all"
        >
          <span>Перейти в меню</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-stone-100">Корзина заказа</h1>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Очистить корзину
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.product.id}
              className="glass-panel p-4 rounded-2xl border border-stone-800 flex items-center gap-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-900">
                <Image
                  src={item.product.image}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-stone-100 truncate">
                  {item.product.title}
                </h3>
                <p className="text-xs text-[#D4A373] font-bold mt-1">
                  {item.product.getFinalPrice()} ₽ за шт.
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-stone-900 rounded-lg p-1 border border-stone-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold px-3 text-stone-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 text-stone-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2">
                <span className="text-base font-black text-stone-100 block">
                  {item.getSubtotal()} ₽
                </span>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1.5 text-stone-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Promo */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-5">
            <h2 className="text-lg font-extrabold text-stone-100">Детали оплаты</h2>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Промокод (TUTTO10)"
                  disabled={promoApplied}
                  className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#D4A373]"
                />
              </div>
              <button
                type="submit"
                disabled={promoApplied}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-stone-700"
              >
                {promoApplied ? <Check className="w-4 h-4 text-emerald-400" /> : 'Применить'}
              </button>
            </form>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs text-stone-400 pt-3 border-t border-stone-800">
              <div className="flex justify-between">
                <span>Стоимость блюд:</span>
                <span>{subtotal} ₽</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Скидка по промокоду ({promoDiscount}%):</span>
                  <span>-{Math.round((subtotal * promoDiscount) / 100)} ₽</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Доставка по Иркутску:</span>
                <span>{deliveryFee === 0 ? 'Бесплатно' : `${deliveryFee} ₽`}</span>
              </div>
              {remainingForFreeDelivery > 0 && (
                <div className="p-2.5 bg-stone-900 rounded-xl text-[11px] text-stone-400 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4A373] shrink-0" />
                  <span>Добавьте еще на {remainingForFreeDelivery} ₽ для бесплатной доставки</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-stone-100 pt-3 border-t border-stone-800">
                <span>К оплате:</span>
                <span className="text-[#D4A373] text-xl">{total} ₽</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
