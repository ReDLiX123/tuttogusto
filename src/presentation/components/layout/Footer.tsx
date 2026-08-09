import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Phone, Send, Globe } from 'lucide-react';

import { getImageUrl } from '@/presentation/utils/imageUtils';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1A1715] border-t border-stone-800 text-stone-400 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block relative h-14 w-52">
              <Image src={getImageUrl('/assets/final_logo.png')} alt="Туттогусто" fill className="object-contain object-left" />
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Атмосферная кофейня в м-н Хрустальный парк. Готовим авторский кофе, свежую выпечку и блюда от шеф-повара с любовью.
            </p>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">Контакты и Адрес</h3>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed">
              <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
              <span>д. Новолисиха, м-н Хрустальный парк, ул. Кленовая, 15/3</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs pt-1">
              <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
              <a href="tel:+79832496019" className="hover:text-[#D4A373] transition-colors font-bold text-stone-200">
                +7 (983) 249-60-19
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4A373]" />
              <span>Режим работы</span>
            </h3>
            <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
              Без выходных
            </span>
            <ul className="space-y-1 text-xs text-stone-300 pt-1 max-w-[210px]">
              <li className="flex justify-between items-center gap-3">
                <span className="text-stone-400 font-medium">Пн – Чт:</span>
                <span className="font-semibold text-stone-200">07:15 – 20:00</span>
              </li>
              <li className="flex justify-between items-center gap-3">
                <span className="text-stone-400 font-medium">Пт:</span>
                <span className="font-semibold text-stone-200">07:15 – 21:00</span>
              </li>
              <li className="flex justify-between items-center gap-3">
                <span className="text-stone-400 font-medium">Сб:</span>
                <span className="font-semibold text-stone-200">09:30 – 21:00</span>
              </li>
              <li className="flex justify-between items-center gap-3">
                <span className="text-stone-400 font-medium">Вс:</span>
                <span className="font-semibold text-stone-200">09:30 – 20:00</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Social */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-stone-200 uppercase tracking-wider">Разделы</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/menu" className="hover:text-[#D4A373] transition-colors">
                  Полное меню и заказ
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#D4A373] transition-colors">
                  Корзина и предзаказ
                </Link>
              </li>
              <li>
                <Link href="/#news" className="hover:text-[#D4A373] transition-colors">
                  Акции и новости кофейни
                </Link>
              </li>
            </ul>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:bg-[#D4A373] hover:text-stone-950 transition-all"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://tuttogusto.ru"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-300 hover:bg-[#D4A373] hover:text-stone-950 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-900 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} Кофейня «Туттогусто» (д. Новолисиха, м-н Хрустальный парк). Все права защищены.
        </div>
      </div>
    </footer>
  );
};
