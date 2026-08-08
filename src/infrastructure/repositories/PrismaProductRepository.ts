import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { prisma } from '../db/prisma';

export class PrismaProductRepository implements IProductRepository {
  public async findAll(): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rawProducts.map((p) => ProductFactory.create(p));
  }

  public async findById(id: string): Promise<Product | null> {
    const rawProduct = await prisma.product.findUnique({
      where: { id },
    });
    return rawProduct ? ProductFactory.create(rawProduct) : null;
  }

  public async findByCategory(categoryId: string): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
      where: { categoryId, isAvailable: true },
      orderBy: { title: 'asc' },
    });
    return rawProducts.map((p) => ProductFactory.create(p));
  }

  public async findFeatured(): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: 8,
    });
    return rawProducts.map((p) => ProductFactory.create(p));
  }

  public async search(query: string): Promise<Product[]> {
    const rawProducts = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });
    return rawProducts.map((p) => ProductFactory.create(p));
  }

  public async create(product: Product): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        type: product.type,
        weightVolume: product.weightVolume,
        prepTime: product.prepTime,
        discount: product.discount,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
      },
    });
    return ProductFactory.create(created);
  }

  public async update(product: Product): Promise<Product> {
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        image: product.image,
        type: product.type,
        weightVolume: product.weightVolume,
        prepTime: product.prepTime,
        discount: product.discount,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
      },
    });
    return ProductFactory.create(updated);
  }

  public async delete(id: string): Promise<boolean> {
    await prisma.product.delete({ where: { id } });
    return true;
  }
}
