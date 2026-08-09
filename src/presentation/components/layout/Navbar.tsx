'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, PhoneCall } from 'lucide-react';
import { useCart } from '@/presentation/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

import { getImageUrl } from '@/presentation/utils/imageUtils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cart, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = cart.getTotalItemsCount();

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/menu', label: 'Меню и Каталог' },
    { href: '/cart', label: 'Корзина' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2A2521]/90 backdrop-blur-md transition-all duration-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">
        {/* Full Image Logo */}
        <Link href="/" className="inline-block relative h-11 w-48 sm:w-56">
          <Image
            src={getImageUrl('/assets/final_logo.png')}
            alt="Туттогусто Иркутск"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-extrabold tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#D4A373] scale-105'
                    : 'text-stone-200 hover:text-[#D4A373]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-4">
          <a
            href="tel:+79832496019"
            className="hidden lg:flex items-center gap-2.5 text-sm font-bold text-stone-100 bg-stone-800/90 px-4 py-2.5 rounded-full border border-stone-700 hover:border-[#D4A373]/60 hover:text-[#D4A373] transition-all shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-[#D4A373]" />
            <span>+7 (983) 249-60-19</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-2.5 bg-gradient-to-r from-[#D4A373] to-[#BC8A5F] hover:from-[#E5B484] hover:to-[#CD9B70] text-stone-950 font-bold rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 px-4 h-11"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-sm font-black">{cart.getTotalAmount()} ₽</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E76F51] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900 animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-stone-900/98 px-4 pt-4 pb-6 space-y-3 border-t border-stone-800 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-bold text-stone-200 hover:text-[#D4A373] py-2.5 border-b border-stone-800"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <div>📍 д. Новолисиха, м-н Хрустальный парк, ул. Кленовая, 15/3</div>
              <div>📞 <a href="tel:+79832496019" className="text-[#D4A373] font-bold">+7 (983) 249-60-19</a></div>
              <div className="text-[11px] text-stone-500 pt-1">
                Без выходных: Пн-Чт 7:15-20:00 | Пт 7:15-21:00 | Сб 9:30-21:00 | Вс 9:30-20:00
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
