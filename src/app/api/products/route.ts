import { NextResponse } from 'next/server';
import { productService } from '@/application/container';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const query = searchParams.get('query');
    const featured = searchParams.get('featured');

    let products;
    if (featured === 'true') {
      products = await productService.getFeaturedProducts();
    } else if (categoryId && categoryId !== 'all') {
      products = await productService.getProductsByCategory(categoryId);
    } else if (query) {
      products = await productService.searchProducts(query);
    } else {
      products = await productService.getAllProducts();
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
    return NextResponse.json([]);
  }
}
