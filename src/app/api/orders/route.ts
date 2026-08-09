import { NextResponse } from 'next/server';
import { orderService, productService } from '@/application/container';
import { Cart } from '@/domain/entities/Cart';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await orderService.getAllOrders();
    const json = orders.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      phone: o.phone,
      address: o.address,
      comments: o.comments,
      status: o.status,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      items: o.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        productTitle: i.productTitle,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.subtotal,
      })),
    }));
    return NextResponse.json(json);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, comments, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 });
    }

    const cart = new Cart();
    for (const item of items) {
      const product = await productService.getProductById(item.productId);
      if (product) {
        cart.addItem(product, item.quantity);
      }
    }

    const createdOrder = await orderService.createOrder({
      customerName,
      phone,
      address,
      comments,
      cart,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrder.id,
        totalAmount: createdOrder.totalAmount,
        status: createdOrder.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка создания заказа' }, { status: 400 });
  }
}
