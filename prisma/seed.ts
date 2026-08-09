import { PrismaClient } from '@prisma/client';
import { STATIC_CATEGORIES, STATIC_PRODUCTS, STATIC_NEWS } from '../src/domain/staticData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Заполняем базу данных всеми 62 реальными блюдами из меню...');

  // 1. Очистка прошлых тестовых данных
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.news.deleteMany();

  // 2. Добавляем 3 основные категории
  for (const cat of STATIC_CATEGORIES) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log(`✅ Создано категорий: ${STATIC_CATEGORIES.length}`);

  // 3. Добавляем все 62 реальных товара из каталога
  for (const p of STATIC_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        type: p.type,
        weightVolume: p.weightVolume,
        prepTime: p.prepTime,
        discount: p.discount ?? 0,
        isAvailable: p.isAvailable ?? true,
        isFeatured: p.isFeatured ?? false,
        categoryId: p.categoryId,
      },
    });
  }
  console.log(`✅ Создано реальных блюд в базе данных: ${STATIC_PRODUCTS.length}`);

  // 4. Добавляем новости
  for (const n of STATIC_NEWS) {
    await prisma.news.create({
      data: {
        id: n.id,
        title: n.title,
        content: n.content,
        image: n.image,
        isPublished: n.isPublished ?? true,
      },
    });
  }
  console.log(`✅ Создано новостей/акций: ${STATIC_NEWS.length}`);

  console.log('🎉 База данных полностью заполнена 62 реальными блюдами кофейни!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
