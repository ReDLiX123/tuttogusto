import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

const CATEGORIES = [
  { id: '1b7a460f-7bcd-4420-bc4b-84191cb35904', name: 'Кухня и Горячие блюда', slug: 'kitchen', sortOrder: 1 },
  { id: '620c2b7f-3e75-4ccc-83b1-7d67d7a2308a', name: 'Авторский кофе и Напитки', slug: 'drinks', sortOrder: 2 },
  { id: '40e9449c-1341-47f7-a782-314049e8a1ed', name: 'Свежая выпечка и Десерты', slug: 'bakery', sortOrder: 3 },
];

const NEWS = [
  {
    id: 'news-1',
    title: 'Новое сезонное меню осенне-зимних напитков в Иркутске!',
    content: 'Согрейтесь авторскими напитками с кедровым орехом, облепихой и пряной корицей. Ждем вас в гости!',
    image: '/assets/menu/slider/slide-2.jpg',
    isPublished: true,
  },
  {
    id: 'news-2',
    title: 'Завтраки весь день по выходным',
    content: 'Каждую субботу и воскресенье готовим наши знаменитые бриоши с лососем и яйцами пашот без ограничений по времени!',
    image: '/assets/menu/slider/slide-3.jpg',
    isPublished: true,
  },
];

async function main() {
  console.log('🌱 Начинаем сид базы данных Supabase...');

  // Seed categories
  console.log('📁 Создаём категории...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }
  console.log('✅ Категории созданы');

  // Seed news
  console.log('📰 Создаём новости...');
  for (const n of NEWS) {
    await prisma.news.upsert({
      where: { id: n.id },
      update: n,
      create: n,
    });
  }
  console.log('✅ Новости созданы');

  // Import static products from staticData
  const { STATIC_PRODUCTS } = await import('../src/domain/staticData.js');

  console.log(`🍽️  Создаём ${STATIC_PRODUCTS.length} товаров...`);
  let count = 0;
  for (const p of STATIC_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        type: p.type,
        weightVolume: p.weightVolume ?? null,
        prepTime: p.prepTime ?? null,
        discount: p.discount ?? 0,
        isAvailable: p.isAvailable,
        isFeatured: p.isFeatured,
        categoryId: p.categoryId,
      },
      create: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        type: p.type,
        weightVolume: p.weightVolume ?? null,
        prepTime: p.prepTime ?? null,
        discount: p.discount ?? 0,
        isAvailable: p.isAvailable,
        isFeatured: p.isFeatured,
        categoryId: p.categoryId,
      },
    });
    count++;
    if (count % 10 === 0) console.log(`  ${count}/${STATIC_PRODUCTS.length}...`);
  }

  console.log(`✅ ${STATIC_PRODUCTS.length} товаров создано`);
  console.log('🎉 Сид завершён успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка сида:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
