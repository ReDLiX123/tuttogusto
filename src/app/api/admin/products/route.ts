import { NextResponse } from 'next/server';
import { productService } from '@/application/container';
import { ProductFactory } from '@/domain/entities/ProductFactory';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = body.id || `PROD-${Date.now().toString(36)}`;
    const product = ProductFactory.create({ ...body, id: productId });
    const created = await productService.createProduct(product);
    return NextResponse.json({ success: true, product: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const product = ProductFactory.create(body);
    const updated = await productService.updateProduct(product);
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    await productService.deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
