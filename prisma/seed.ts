import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем сидирование базы данных...');

  // Очистка старых данных
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.news.deleteMany();

  // 1. Категории
  const kitchenCat = await prisma.category.create({
    data: { name: 'Кухня и Горячие блюда', slug: 'kitchen', sortOrder: 1 },
  });

  const drinksCat = await prisma.category.create({
    data: { name: 'Авторский кофе и Напитки', slug: 'drinks', sortOrder: 2 },
  });

  const bakeryCat = await prisma.category.create({
    data: { name: 'Свежая выпечка и Десерты', slug: 'bakery', sortOrder: 3 },
  });

  console.log('✅ Категории успешно созданы');

  // 2. Блюда Кухни (DISH)
  const kitchenProducts = [
    {
      title: 'Паста Карбонара с гуанчиале',
      description: 'Классическая итальянская паста с подкопченным щекочеством, яичным желтком и сыром Пармезан.',
      price: 520,
      image: '/assets/menu/kitchen/1-6.jpg',
      type: 'DISH',
      weightVolume: '320г',
      prepTime: 20,
      isFeatured: true,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Стейк из лосося с соусом тар-тар',
      description: 'Нежное филе лосося на гриле, подается с паровым брокколи и цитрусовым соусом.',
      price: 890,
      image: '/assets/menu/kitchen/1-7.jpg',
      type: 'DISH',
      weightVolume: '280г',
      prepTime: 25,
      isFeatured: true,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Салат Цезарь с сочной креветкой',
      description: 'Хрустящий романо, тигровые креветки на гриле, соус из анчоусов и пармезановые чипсы.',
      price: 640,
      image: '/assets/menu/kitchen/1-8.jpg',
      type: 'DISH',
      weightVolume: '250г',
      prepTime: 15,
      isFeatured: true,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Том Ям с морепродуктами',
      description: 'Пряный тайский суп на кокосовом молоке с креветками, кальмаром и грибами цаогу.',
      price: 680,
      image: '/assets/menu/kitchen/10.jpg',
      type: 'DISH',
      weightVolume: '400мл',
      prepTime: 18,
      isFeatured: false,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Сытный завтрак «Туттогусто»',
      description: 'Яйца пашот на бриоши, авокадо, слабосоленый лосось и свежий микс салатов.',
      price: 580,
      image: '/assets/menu/kitchen/11.jpg',
      type: 'DISH',
      weightVolume: '350г',
      prepTime: 15,
      isFeatured: true,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Ризотто с белыми грибами',
      description: 'Итальянский рис арборио, ароматизированный белым вином и трюфельным маслом.',
      price: 590,
      image: '/assets/menu/kitchen/12.jpg',
      type: 'DISH',
      weightVolume: '300г',
      prepTime: 22,
      isFeatured: false,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Бургер с рваной говядиной и чеддером',
      description: 'Сочная томленая говядина, карамелизованный лук, фирменный соус барбекю и картофель фри.',
      price: 650,
      image: '/assets/menu/kitchen/13.jpg',
      type: 'DISH',
      weightVolume: '420г',
      prepTime: 20,
      isFeatured: true,
      categoryId: kitchenCat.id,
    },
    {
      title: 'Поке с лососем и киноа',
      description: 'Свежий лосось, авокадо, чука, бобы эдамаме и азиатская заправка на основе понзу.',
      price: 610,
      image: '/assets/menu/kitchen/14.jpg',
      type: 'DISH',
      weightVolume: '340г',
      prepTime: 12,
      isFeatured: false,
      categoryId: kitchenCat.id,
    },
  ];

  for (const p of kitchenProducts) {
    await prisma.product.create({ data: p });
  }

  // 3. Напитки (DRINK)
  const drinksProducts = [
    {
      title: 'Раф Кедровый Иркутский',
      description: 'Фирменный напиток с натуральным кедровым сиропом и дробленым орехом.',
      price: 360,
      image: '/assets/menu/drinks/36.jpg',
      type: 'DRINK',
      weightVolume: '350мл',
      isFeatured: true,
      categoryId: drinksCat.id,
    },
    {
      title: 'Капучино Овсяный salted caramel',
      description: 'Классический двойной эспрессо на овсяном молоке с добавлением соленой карамели.',
      price: 320,
      image: '/assets/menu/drinks/37.jpg',
      type: 'DRINK',
      weightVolume: '300мл',
      isFeatured: true,
      categoryId: drinksCat.id,
    },
    {
      title: 'Латте Малина-Фисташка',
      description: 'Нежный кофейный напиток с натуральным пюре малины и фисташковой пастой.',
      price: 380,
      image: '/assets/menu/drinks/38.jpg',
      type: 'DRINK',
      weightVolume: '400мл',
      isFeatured: true,
      categoryId: drinksCat.id,
    },
    {
      title: 'Айс-Matcha Латте',
      description: 'Японский церемониальный зелёный чай матча с холодным миндальным молоком.',
      price: 340,
      image: '/assets/menu/drinks/39.jpg',
      type: 'DRINK',
      weightVolume: '350мл',
      isFeatured: false,
      categoryId: drinksCat.id,
    },
    {
      title: 'Фильтр-кофе Эфиопия Иргачефф',
      description: 'Светлая обжарка с ярким цветочным ароматом, нотами бергамота и персика.',
      price: 260,
      image: '/assets/menu/drinks/40.jpg',
      type: 'DRINK',
      weightVolume: '250мл',
      isFeatured: false,
      categoryId: drinksCat.id,
    },
    {
      title: 'Авторский чай «Байкальская облепиха»',
      description: 'Согревающий чай из свежей облепихи, имбиря, меда и розмарина.',
      price: 390,
      image: '/assets/menu/drinks/41.jpg',
      type: 'DRINK',
      weightVolume: '600мл',
      isFeatured: true,
      categoryId: drinksCat.id,
    },
  ];

  for (const p of drinksProducts) {
    await prisma.product.create({ data: p });
  }

  // 4. Выпечка и Десерты (BAKERY)
  const bakeryProducts = [
    {
      title: 'Миндальный круассан',
      description: 'Французский хрустящий круассан с щедрой начинкой из франжипана и лепестками миндаля.',
      price: 280,
      image: '/assets/menu/bakery/25.jpg',
      type: 'BAKERY',
      weightVolume: '140г',
      isFeatured: true,
      categoryId: bakeryCat.id,
    },
    {
      title: 'Чизкейк Сан-Себастьян',
      description: 'Нежнейший обожженный баскский чизкейк с карамельной корочкой и ягодным кули.',
      price: 390,
      image: '/assets/menu/bakery/26.jpg',
      type: 'BAKERY',
      weightVolume: '180г',
      isFeatured: true,
      categoryId: bakeryCat.id,
    },
    {
      title: 'Тарталетка с соленой карамелью и пеканом',
      description: 'Песочная основа сабле, тягучая домашняя карамель и отборный орех пекан.',
      price: 340,
      image: '/assets/menu/bakery/27.jpg',
      type: 'BAKERY',
      weightVolume: '130г',
      isFeatured: false,
      categoryId: bakeryCat.id,
    },
    {
      title: 'Эклер Ваниль-Бурбон',
      description: 'Заварное тесто с покрытием из белого шоколада и кремом на основе настоящей мадагаскарской ванили.',
      price: 250,
      image: '/assets/menu/bakery/30.jpg',
      type: 'BAKERY',
      weightVolume: '110г',
      isFeatured: false,
      categoryId: bakeryCat.id,
    },
  ];

  for (const p of bakeryProducts) {
    await prisma.product.create({ data: p });
  }

  console.log('✅ Продукты успешно созданы');

  // 5. Новости и Акции
  await prisma.news.createMany({
    data: [
      {
        title: 'Новое сезонное меню осенне-зимних напитков в Иркутске!',
        content: 'Согрейтесь авторскими напитками с кедровым орехом, облепихой и пряной корицей. Ждем вас в гости!',
        image: '/assets/menu/slider/slide-2.jpg',
        isPublished: true,
      },
      {
        title: 'Завтраки весь день по выходным',
        content: 'Каждую субботу и воскресенье готовим наши знаменитые бриоши с лососем и яйцами пашот без ограничений по времени!',
        image: '/assets/menu/slider/slide-3.jpg',
        isPublished: true,
      },
      {
        title: 'Свежая выпечка каждое утро от нашего шеф-кондитера',
        content: 'Приходите к 8:00 за самыми хрустящими миндальными круассанами в городе!',
        image: '/assets/menu/slider/slide-4.jpg',
        isPublished: true,
      },
    ],
  });

  console.log('✅ Новости и акции успешно созданы');
  console.log('🎉 Сидирование завершено!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
