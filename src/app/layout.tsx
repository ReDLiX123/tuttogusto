import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/presentation/context/CartContext';
import { Navbar } from '@/presentation/components/layout/Navbar';
import { Footer } from '@/presentation/components/layout/Footer';
import { CartDrawer } from '@/presentation/components/cart/CartDrawer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Кофейня Туттогусто | Авторский кофе, кухни и свежая выпечка в Иркутске',
  description:
    'Доставка и самовывоз вкуснейших блюд, свежей выпечки и спешелти кофе в Иркутске от кофейни Tuttogusto. Быстрая доставка от 30 минут.',
  keywords: ['кофейня Иркутск', 'доставка кофе', 'Туттогусто', 'выпечка Иркутск', 'завтраки Иркутск'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jakarta.variable} scroll-smooth`}>
      <body className="bg-[#1F1C19] text-stone-100 min-h-screen flex flex-col antialiased selection:bg-[#D4A373] selection:text-stone-950">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
