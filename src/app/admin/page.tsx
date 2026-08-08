'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, RefreshCw, CheckCircle, Clock, XCircle, ShoppingBag, ShieldAlert, Tag, Newspaper } from 'lucide-react';

interface OrderItemDTO {
  id: string;
  productTitle: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderDTO {
  id: string;
  customerName: string;
  phone: string;
  address?: string;
  comments?: string;
  status: 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  items: OrderItemDTO[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full text-xs font-black border border-amber-500/30 flex items-center gap-1"><Clock className="w-3 h-3" /> НОВЫЙ</span>;
      case 'PROCESSING':
        return <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full text-xs font-black border border-blue-500/30 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> ГОТОВИТСЯ</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-black border border-emerald-500/30 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ВЫПОЛНЕН</span>;
      case 'CANCELLED':
        return <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full text-xs font-black border border-red-500/30 flex items-center gap-1"><XCircle className="w-3 h-3" /> ОТМЕНЕН</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Admin Nav */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-stone-800">
        <div>
          <h1 className="text-2xl font-black text-stone-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#E76F51]" />
            <span>Панель Администратора</span>
          </h1>
          <p className="text-xs text-stone-400">Управление заказами, меню и новостями кофейни «Туттогусто»</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-4 py-2 bg-[#D4A373] text-stone-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow">
            <Package className="w-4 h-4" /> Заказы
          </Link>
          <Link href="/admin/products" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Tag className="w-4 h-4" /> Товары и Меню
          </Link>
          <Link href="/admin/news" className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-stone-700">
            <Newspaper className="w-4 h-4" /> Новости
          </Link>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-100">Текущие заказы клиентов ({orders.length})</h2>
          <button
            onClick={fetchOrders}
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Обновить
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-stone-400 text-xs">Загрузка заказов...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl border border-stone-800 text-stone-500 text-xs">
            Заказов пока нет
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass-panel p-5 rounded-2xl border border-stone-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-stone-100">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xs text-stone-400 mt-1">
                      {new Date(order.createdAt).toLocaleString('ru-RU')} • Клиент:{' '}
                      <strong className="text-stone-200">{order.customerName}</strong> ({order.phone})
                    </p>
                    {order.address && (
                      <p className="text-xs text-[#D4A373] mt-0.5">📍 Доставка: {order.address}</p>
                    )}
                    {order.comments && (
                      <p className="text-xs text-stone-400 italic mt-0.5">💬 Комментарий: {order.comments}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-[#D4A373]">{order.totalAmount} ₽</span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 text-xs text-stone-300">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        • {item.productTitle} <span className="text-stone-500">x{item.quantity}</span>
                      </span>
                      <span>{item.subtotal} ₽</span>
                    </div>
                  ))}
                </div>

                {/* Status action buttons */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-800">
                  <span className="text-xs text-stone-500 self-center mr-2 font-semibold">Сменить статус:</span>
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                    className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600 text-blue-200 text-xs font-bold rounded-lg transition-colors border border-blue-500/40"
                  >
                    В работу
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 text-xs font-bold rounded-lg transition-colors border border-emerald-500/40"
                  >
                    Выполнен
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                    className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600 text-red-200 text-xs font-bold rounded-lg transition-colors border border-red-500/40"
                  >
                    Отменить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
