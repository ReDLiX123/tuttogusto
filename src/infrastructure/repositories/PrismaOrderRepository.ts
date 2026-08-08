import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { Order, OrderItem, OrderStatus } from '@/domain/entities/Order';
import { prisma } from '../db/prisma';

export class PrismaOrderRepository implements IOrderRepository {
  public async findAll(): Promise<Order[]> {
    const rawOrders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rawOrders.map(
      (o) =>
        new Order({
          id: o.id,
          customerName: o.customerName,
          phone: o.phone,
          address: o.address ?? undefined,
          comments: o.comments ?? undefined,
          status: o.status as OrderStatus,
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
          items: o.items.map(
            (i) =>
              new OrderItem({
                id: i.id,
                productId: i.productId,
                productTitle: i.product.title,
                quantity: i.quantity,
                price: i.price,
              })
          ),
        })
    );
  }

  public async findById(id: string): Promise<Order | null> {
    const o = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!o) return null;

    return new Order({
      id: o.id,
      customerName: o.customerName,
      phone: o.phone,
      address: o.address ?? undefined,
      comments: o.comments ?? undefined,
      status: o.status as OrderStatus,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      items: o.items.map(
        (i) =>
          new OrderItem({
            id: i.id,
            productId: i.productId,
            productTitle: i.product.title,
            quantity: i.quantity,
            price: i.price,
          })
      ),
    });
  }

  public async create(order: Order): Promise<Order> {
    const created = await prisma.order.create({
      data: {
        id: order.id,
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        comments: order.comments,
        status: order.status,
        totalAmount: order.totalAmount,
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return new Order({
      id: created.id,
      customerName: created.customerName,
      phone: created.phone,
      address: created.address ?? undefined,
      comments: created.comments ?? undefined,
      status: created.status as OrderStatus,
      totalAmount: created.totalAmount,
      createdAt: created.createdAt,
      items: created.items.map(
        (i) =>
          new OrderItem({
            id: i.id,
            productId: i.productId,
            productTitle: i.product.title,
            quantity: i.quantity,
            price: i.price,
          })
      ),
    });
  }

  public async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return new Order({
      id: updated.id,
      customerName: updated.customerName,
      phone: updated.phone,
      address: updated.address ?? undefined,
      comments: updated.comments ?? undefined,
      status: updated.status as OrderStatus,
      totalAmount: updated.totalAmount,
      createdAt: updated.createdAt,
      items: updated.items.map(
        (i) =>
          new OrderItem({
            id: i.id,
            productId: i.productId,
            productTitle: i.product.title,
            quantity: i.quantity,
            price: i.price,
          })
      ),
    });
  }
}
