import { INewsRepository } from '@/domain/repositories/INewsRepository';
import { News } from '@/domain/entities/News';
import { prisma } from '../db/prisma';

export class PrismaNewsRepository implements INewsRepository {
  public async findAll(publishedOnly: boolean = true): Promise<News[]> {
    const raw = await prisma.news.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return raw.map((n) => new News(n));
  }

  public async findById(id: string): Promise<News | null> {
    const raw = await prisma.news.findUnique({ where: { id } });
    return raw ? new News(raw) : null;
  }

  public async create(news: News): Promise<News> {
    const created = await prisma.news.create({
      data: {
        id: news.id,
        title: news.title,
        content: news.content,
        image: news.image,
        isPublished: news.isPublished,
      },
    });
    return new News(created);
  }

  public async update(news: News): Promise<News> {
    const updated = await prisma.news.update({
      where: { id: news.id },
      data: {
        title: news.title,
        content: news.content,
        image: news.image,
        isPublished: news.isPublished,
      },
    });
    return new News(updated);
  }

  public async delete(id: string): Promise<boolean> {
    await prisma.news.delete({ where: { id } });
    return true;
  }
}
