import { NextResponse } from 'next/server';
import { productService } from '@/application/container';
import { STATIC_PRODUCTS } from '@/domain/staticData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('query');
    const featured = searchParams.get('featured');

    let products: any[] = [];
    try {
      if (featured === 'true') {
        products = await productService.getFeaturedProducts();
      } else if (categoryId && categoryId !== 'all') {
        products = await productService.getProductsByCategory(categoryId);
      } else if (query) {
        products = await productService.searchProducts(query);
      } else {
        products = await productService.getAllProducts();
      }
    } catch (e) {
      products = [];
    }

    if (!products || products.length === 0) {
      let filtered = STATIC_PRODUCTS;
      if (featured === 'true') {
        filtered = STATIC_PRODUCTS.filter((p) => p.isFeatured);
      } else if (categoryId && categoryId !== 'all') {
        filtered = STATIC_PRODUCTS.filter((p) => p.categoryId === categoryId);
      } else if (query) {
        const q = query.toLowerCase();
        filtered = STATIC_PRODUCTS.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      return NextResponse.json(
        filtered.map((p) => ({
          ...p,
          finalPrice: p.price,
          badge: p.type === 'DISH' ? (p.prepTime ? `Готовка ~${p.prepTime} мин` : 'Свежее') : (p.weightVolume || 'Порция'),
        }))
      );
    }

    const jsonProducts = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      price: p.price,
      finalPrice: p.getFinalPrice(),
      image: p.image,
      type: p.type,
      weightVolume: p.weightVolume,
      prepTime: p.prepTime,
      discount: p.discount,
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
      categoryId: p.categoryId,
      badge: p.getFormattedBadge(),
    }));

    return NextResponse.json(jsonProducts);
  } catch (error: any) {
    return NextResponse.json(STATIC_PRODUCTS);
  }
}
