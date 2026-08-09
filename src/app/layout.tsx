import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/presentation/context/CartContext';
import { Navbar } from '@/presentation/components/layout/Navbar';
import { Footer } from '@/presentation/components/layout/Footer';
import { CartDrawer } from '@/presentation/components/cart/CartDrawer';
import { SchemaOrg } from '@/presentation/components/seo/SchemaOrg';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuttogusto.ru';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Кофейня Туттогусто | Авторский кофе, кулинария и свежая выпечка в Иркутске',
  description:
    'Онлайн-предзаказ вкуснейших блюд, свежей выпечки и спешелти кофе в кофейне Tuttogusto (Хрустальный парк). Оформляйте заказ заранее и забирайте без очереди!',
  keywords: ['кофейня Иркутск', 'предзаказ кофе', 'Туттогусто', 'выпечка Иркутск', 'завтраки Хрустальный парк', 'кофе с собой Иркутск'],
  openGraph: {
    title: 'Кофейня Туттогусто | Быстрый онлайн-предзаказ без очереди в Иркутске',
    description: 'Готовим свежие круассаны, спешелти кофе и сытные горячие блюда. Заказывайте онлайн и забирайте горячим к вашему приходу!',
    url: baseUrl,
    siteName: 'Туттогусто',
    images: [
      {
        url: '/assets/menu/slider/slide-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Атмосфера Туттогусто',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Кофейня Туттогусто | Быстрый онлайн-предзаказ',
    description: 'Спешелти кофе, горячие блюда и свежие круассаны в Иркутске.',
    images: ['/assets/menu/slider/slide-2.jpg'],
  },
  icons: {
    icon: '/assets/cropped-favicon-150x150.png',
    shortcut: '/assets/cropped-favicon-150x150.png',
    apple: '/assets/cropped-favicon-150x150.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${inter.variable} ${fraunces.variable} scroll-smooth`}>
      <body className="font-sans bg-[#1F1C19] text-stone-100 min-h-screen flex flex-col antialiased selection:bg-[#D4A373] selection:text-stone-950">
        <SchemaOrg />
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
