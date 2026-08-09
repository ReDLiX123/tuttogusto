import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { prisma } from '../db/prisma';

let inMemoryProductsMap = new Map<string, Product>();
let inMemoryDeletedIds = new Set<string>();

export class PrismaProductRepository implements IProductRepository {
  public async findAll(): Promise<Product[]> {
    let dbProducts: Product[] = [];
    try {
      const rawProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      dbProducts = rawProducts.map((p) => ProductFactory.create(p));
    } catch (e) {
      console.warn('Prisma findAll failed, using fallback:', e);
    }

    const map = new Map<string, Product>();
    // First populate database products
    for (const p of dbProducts) {
      if (!inMemoryDeletedIds.has(p.id)) {
        map.set(p.id, p);
      }
    }
    // Override with in-memory additions/updates
    for (const [id, p] of inMemoryProductsMap.entries()) {
      if (!inMemoryDeletedIds.has(id)) {
        map.set(id, p);
      }
    }

    return Array.from(map.values());
  }

  public async findById(id: string): Promise<Product | null> {
    if (inMemoryDeletedIds.has(id)) return null;
    if (inMemoryProductsMap.has(id)) return inMemoryProductsMap.get(id)!;

    try {
      const rawProduct = await prisma.product.findUnique({ where: { id } });
      return rawProduct ? ProductFactory.create(rawProduct) : null;
    } catch (e) {
      return null;
    }
  }

  public async findByCategory(categoryId: string): Promise<Product[]> {
    const all = await this.findAll();
    return all.filter((p) => p.categoryId === categoryId && p.isAvailable);
  }

  public async findFeatured(): Promise<Product[]> {
    const all = await this.findAll();
    return all.filter((p) => p.isFeatured && p.isAvailable).slice(0, 8);
  }

  public async search(query: string): Promise<Product[]> {
    const all = await this.findAll();
    const q = query.toLowerCase();
    return all.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  public async create(product: Product): Promise<Product> {
    try {
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
    } catch (error) {
      console.warn('Prisma create failed (read-only environment), saving in-memory:', error);
      inMemoryProductsMap.set(product.id, product);
      inMemoryDeletedIds.delete(product.id);
      return product;
    }
  }

  public async update(product: Product): Promise<Product> {
    try {
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
    } catch (error) {
      console.warn('Prisma update failed (read-only environment), updating in-memory:', error);
      inMemoryProductsMap.set(product.id, product);
      inMemoryDeletedIds.delete(product.id);
      return product;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({ where: { id } });
    } catch (error) {
      console.warn('Prisma delete failed (read-only environment), deleting in-memory:', error);
    }
    inMemoryProductsMap.delete(id);
    inMemoryDeletedIds.add(id);
    return true;
  }
}
