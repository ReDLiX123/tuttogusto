import React from 'react';

interface SchemaOrgProps {
  products?: any[];
  categories?: any[];
}

export const SchemaOrg: React.FC<SchemaOrgProps> = ({ products = [] }) => {
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Кофейня Туттогусто',
    image: 'https://tuttogusto.ru/assets/menu/slider/slide-2.jpg',
    '@id': 'https://tuttogusto.ru',
    url: 'https://tuttogusto.ru',
    telephone: '+79832496019',
    priceRange: '₽₽',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ул. Кленовая, 15/3, м-н Хрустальный парк',
      addressLocality: 'д. Новолисиха, Иркутский район',
      addressRegion: 'Иркутская область',
      postalCode: '664540',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.2045,
      longitude: 104.3821,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '07:15',
        closes: '22:00',
      },
    ],
    servesCuisine: ['Coffee', 'Italian', 'Bakery', 'Breakfast'],
    hasMenu: 'https://tuttogusto.ru/menu',
  };

  const menuSchema = products.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Меню кофейни Туттогусто',
    hasMenuItem: products.map((p) => ({
      '@type': 'MenuItem',
      name: p.title,
      description: p.description,
      image: p.image,
      offers: {
        '@type': 'Offer',
        price: p.finalPrice || p.price,
        priceCurrency: 'RUB',
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      {menuSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(menuSchema) }}
        />
      )}
    </>
  );
};
