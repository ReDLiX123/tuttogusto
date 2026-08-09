import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';
import { ProductFactory } from '@/domain/entities/ProductFactory';
import { prisma } from '../db/prisma';
import { STATIC_PRODUCTS } from '@/domain/staticData';

let inMemoryProductsMap = new Map<string, Product>();
let inMemoryDeletedIds = new Set<string>();

// Initialize in-memory map with 62 static products if empty
function getProductsMap(): Map<string, Product> {
  if (inMemoryProductsMap.size === 0) {
    for (const p of STATIC_PRODUCTS) {
      inMemoryProductsMap.set(p.id, ProductFactory.create(p));
    }
  }
  return inMemoryProductsMap;
}

export class PrismaProductRepository implements IProductRepository {
  public async findAll(): Promise<Product[]> {
    let dbProducts: Product[] = [];
    try {
      const rawProducts = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      dbProducts = rawProducts.map((p) => ProductFactory.create(p));
    } catch (e) {
      console.warn('Prisma findAll warning:', e);
    }

    const map = new Map<string, Product>();

    // 1. Populate initial 62 static products
    const staticMap = getProductsMap();
    for (const [id, p] of staticMap.entries()) {
      if (!inMemoryDeletedIds.has(id)) {
        map.set(id, p);
      }
    }

    // 2. Populate database products (if available)
    for (const p of dbProducts) {
      if (!inMemoryDeletedIds.has(p.id)) {
        map.set(p.id, p);
      }
    }

    // 3. Override with any active in-memory additions/edits
    for (const [id, p] of inMemoryProductsMap.entries()) {
      if (!inMemoryDeletedIds.has(id)) {
        map.set(id, p);
      }
    }

    return Array.from(map.values());
  }

  public async findById(id: string): Promise<Product | null> {
    if (inMemoryDeletedIds.has(id)) return null;
    const map = getProductsMap();
    if (map.has(id)) return map.get(id)!;

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
    const map = getProductsMap();
    map.set(product.id, product);
    inMemoryDeletedIds.delete(product.id);

    try {
      await prisma.product.create({
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
    } catch (error) {
      console.warn('Prisma create warning (read-only mode), saved in-memory:', error);
    }
    return product;
  }

  public async update(product: Product): Promise<Product> {
    const map = getProductsMap();
    map.set(product.id, product);
    inMemoryDeletedIds.delete(product.id);

    try {
      await prisma.product.update({
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
    } catch (error) {
      console.warn('Prisma update warning (read-only mode), updated in-memory:', error);
    }
    return product;
  }

  public async delete(id: string): Promise<boolean> {
    const map = getProductsMap();
    map.delete(id);
    inMemoryDeletedIds.add(id);

    try {
      await prisma.product.delete({ where: { id } });
    } catch (error) {
      console.warn('Prisma delete warning (read-only mode), deleted in-memory:', error);
    }
    return true;
  }
}
