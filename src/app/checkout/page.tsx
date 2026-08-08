'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/presentation/context/CartContext';
import { pricingService } from '@/application/container';
import { CheckCircle2, ShoppingBag, ArrowLeft, Loader2, Phone, MapPin, User, FileText } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const subtotal = pricingService.calculateSubtotal(cart);
  const total = pricingService.calculateTotal(cart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Пожалуйста, заполните имя и номер телефона!');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          comments,
          items: cart.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при оформлении');

      setCreatedOrderId(data.order.id);
      clearCart();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdOrderId) {
    return (
      <div className="py-20 text-center space-y-6 max-w-lg mx-auto glass-panel p-8 rounded-3xl border border-[#D4A373]/30 my-8">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-black text-stone-100">Заказ успешно оформлен!</h1>
        <div className="bg-stone-900/80 p-4 rounded-xl text-left text-xs space-y-2 text-stone-300 border border-stone-800">
          <p>
            Номер заказа: <strong className="text-[#D4A373] text-sm">{createdOrderId}</strong>
          </p>
          <p>
            Имя клиента: <strong>{customerName}</strong>
          </p>
          <p>
            Телефон: <strong>{phone}</strong>
          </p>
          {address && (
            <p>
              Адрес доставки: <strong>{address}</strong>
            </p>
          )}
          <p>
            Статус: <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-extrabold">НОВЫЙ</span>
          </p>
        </div>
        <p className="text-xs text-stone-400">
          Наш администратор кофейни «Туттогусто» свяжется с вами в течение 5 минут для подтверждения заказа.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#D4A373] hover:bg-[#E5B484] text-stone-950 px-8 py-3 rounded-full font-black text-xs transition-all"
        >
          <span>Вернуться на главную</span>
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-200">Корзина пуста</h2>
        <Link href="/menu" className="text-xs text-[#D4A373] hover:underline">
          Вернуться к меню
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-3xl font-black text-stone-100">Оформление заказа</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Col */}
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-4">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4A373]" />
              <span>Данные покупателя</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Ваше имя *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Например, Александр"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Номер телефона *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (900) 000-00-00"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-4">
            <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4A373]" />
              <span>Доставка по Иркутску</span>
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Адрес (улица, дом, квартира)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ул. Карла Маркса, д. 10, кв. 4 (Оставьте пустым для самовывоза)"
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Комментарии к заказу
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Пожелания к времени доставки, звонку или упаковке..."
                    className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#D4A373]"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] text-stone-950 rounded-xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Оформляем заказ...</span>
              </>
            ) : (
              <span>Подтвердить заказ • {total} ₽</span>
            )}
          </button>
        </form>

        {/* Summary side */}
        <div className="glass-panel p-6 rounded-2xl border border-stone-800 space-y-4 h-fit">
          <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#D4A373]" />
            <span>Состав заказа ({cart.getTotalItemsCount()})</span>
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-xs text-stone-300">
                <span className="truncate max-w-[180px]">
                  {item.product.title} x{item.quantity}
                </span>
                <span className="font-bold text-stone-100">{item.getSubtotal()} ₽</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800 text-xs space-y-1.5 text-stone-400">
            <div className="flex justify-between">
              <span>Сумма:</span>
              <span>{subtotal} ₽</span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-100 pt-2 border-t border-stone-800">
              <span>Итого:</span>
              <span className="text-[#D4A373]">{total} ₽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
