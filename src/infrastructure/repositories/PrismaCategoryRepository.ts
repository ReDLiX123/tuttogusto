import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/Category';
import { prisma } from '../db/prisma';

export class PrismaCategoryRepository implements ICategoryRepository {
  public async findAll(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return categories.map((c) => new Category(c));
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({ where: { slug } });
    return raw ? new Category(raw) : null;
  }

  public async findById(id: string): Promise<Category | null> {
    const raw = await prisma.category.findUnique({ where: { id } });
    return raw ? new Category(raw) : null;
  }

  public async create(category: Category): Promise<Category> {
    const created = await prisma.category.create({
      data: {
        id: category.id,
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
    return new Category(created);
  }

  public async update(category: Category): Promise<Category> {
    const updated = await prisma.category.update({
      where: { id: category.id },
      data: {
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      },
    });
    return new Category(updated);
  }

  public async delete(id: string): Promise<boolean> {
    await prisma.category.delete({ where: { id } });
    return true;
  }
}
