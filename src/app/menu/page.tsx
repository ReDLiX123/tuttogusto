import React from 'react';
import { Metadata } from 'next';
import { productService, categoryRepo } from '@/application/container';
import { STATIC_CATEGORIES, STATIC_PRODUCTS } from '@/domain/staticData';
import { MenuClient } from '@/presentation/components/catalog/MenuClient';

export const metadata: Metadata = {
  title: 'Меню & Каталог блюд | Кофейня Туттогусто Иркутск',
  description:
    'Авторский кофе, горячие блюда кухни, завтраки и свежая выпечка в кофейне Туттогусто. Оформляйте онлайн-предзаказ и забирайте готовые блюда без ожидания в очереди.',
  keywords: ['меню Иркутск', 'предзаказ кофе Иркутск', 'завтраки Хрустальный парк', 'авторский кофе', 'выпечка'],
  openGraph: {
    title: 'Меню кофейни Туттогусто | Онлайн-предзаказ блюд и кофе',
    description: 'Авторские блюда, спешелти кофе и свежие круассаны. Заказывайте заранее и забирайте горячим!',
    url: 'https://tuttogusto.ru/menu',
    siteName: 'Туттогусто',
    images: [
      {
        url: '/assets/menu/slider/slide-2.jpg',
        width: 1200,
        height: 630,
        alt: 'Меню Туттогусто',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Меню & Каталог блюд | Кофейня Туттогусто',
    description: 'Авторский кофе, горячие блюда кухни и свежая выпечка в Иркутске.',
    images: ['/assets/menu/slider/slide-2.jpg'],
  },
};

export default async function MenuPage() {
  let categories: any[] = [];
  let products: any[] = [];

  try {
    const domainCategories = await categoryRepo.findAll();
    const domainProducts = await productService.getAllProducts();

    categories = domainCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sortOrder,
    }));

    products = domainProducts.map((p) => p.toPlainObject());
  } catch (e) {
    // Fallback dataset if database fails or is empty
    categories = STATIC_CATEGORIES;
    products = STATIC_PRODUCTS.map((p) => ({
      ...p,
      finalPrice: p.price,
      badgeText:
        p.type === 'DISH'
          ? p.prepTime
            ? `Готовка ~${p.prepTime} мин`
            : 'Свежее'
          : p.weightVolume || 'Порция',
    }));
  }

  if (categories.length === 0) {
    categories = STATIC_CATEGORIES;
  }

  if (products.length === 0) {
    products = STATIC_PRODUCTS.map((p) => ({
      ...p,
      finalPrice: p.price,
      badgeText:
        p.type === 'DISH'
          ? p.prepTime
            ? `Готовка ~${p.prepTime} мин`
            : 'Свежее'
          : p.weightVolume || 'Порция',
    }));
  }

  return (
    <MenuClient
      initialCategories={categories}
      initialProducts={products}
    />
  );
}
