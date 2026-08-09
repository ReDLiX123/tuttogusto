import { NextResponse } from 'next/server';
import { orderService } from '@/application/container';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await orderService.getAllOrders();
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }
    const updated = await orderService.updateOrderStatus(orderId, status);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
