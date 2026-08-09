import { INewsRepository } from '@/domain/repositories/INewsRepository';
import { News } from '@/domain/entities/News';
import { prisma } from '../db/prisma';
import { STATIC_NEWS } from '@/domain/staticData';

let inMemoryNewsMap = new Map<string, News>();
let inMemoryDeletedIds = new Set<string>();

function getNewsMap(): Map<string, News> {
  if (inMemoryNewsMap.size === 0) {
    for (const n of STATIC_NEWS) {
      inMemoryNewsMap.set(n.id, new News(n as any));
    }
  }
  return inMemoryNewsMap;
}

export class PrismaNewsRepository implements INewsRepository {
  public async findAll(publishedOnly: boolean = true): Promise<News[]> {
    let dbNews: News[] = [];
    try {
      const raw = await prisma.news.findMany({
        where: publishedOnly ? { isPublished: true } : undefined,
        orderBy: { createdAt: 'desc' },
      });
      dbNews = raw.map((n) => new News(n));
    } catch (e) {
      console.warn('Prisma news findAll warning:', e);
    }

    const map = new Map<string, News>();

    // 1. Initial static news
    const staticMap = getNewsMap();
    for (const [id, n] of staticMap.entries()) {
      if (!inMemoryDeletedIds.has(id)) {
        if (!publishedOnly || n.isPublished) {
          map.set(id, n);
        }
      }
    }

    // 2. Database news if available
    for (const n of dbNews) {
      if (!inMemoryDeletedIds.has(n.id)) {
        if (!publishedOnly || n.isPublished) {
          map.set(n.id, n);
        }
      }
    }

    // 3. Active in-memory additions/edits
    for (const [id, n] of inMemoryNewsMap.entries()) {
      if (!inMemoryDeletedIds.has(id)) {
        if (!publishedOnly || n.isPublished) {
          map.set(id, n);
        }
      }
    }

    return Array.from(map.values());
  }

  public async findById(id: string): Promise<News | null> {
    if (inMemoryDeletedIds.has(id)) return null;
    const map = getNewsMap();
    if (map.has(id)) return map.get(id)!;

    try {
      const raw = await prisma.news.findUnique({ where: { id } });
      return raw ? new News(raw) : null;
    } catch (e) {
      return null;
    }
  }

  public async create(news: News): Promise<News> {
    const map = getNewsMap();
    map.set(news.id, news);
    inMemoryDeletedIds.delete(news.id);

    try {
      await prisma.news.create({
        data: {
          id: news.id,
          title: news.title,
          content: news.content,
          image: news.image,
          isPublished: news.isPublished,
        },
      });
    } catch (error) {
      console.warn('Prisma news create warning (read-only environment), saved in-memory:', error);
    }
    return news;
  }

  public async update(news: News): Promise<News> {
    const map = getNewsMap();
    map.set(news.id, news);
    inMemoryDeletedIds.delete(news.id);

    try {
      await prisma.news.update({
        where: { id: news.id },
        data: {
          title: news.title,
          content: news.content,
          image: news.image,
          isPublished: news.isPublished,
        },
      });
    } catch (error) {
      console.warn('Prisma news update warning (read-only environment), updated in-memory:', error);
    }
    return news;
  }

  public async delete(id: string): Promise<boolean> {
    const map = getNewsMap();
    map.delete(id);
    inMemoryDeletedIds.add(id);

    try {
      await prisma.news.delete({ where: { id } });
    } catch (error) {
      console.warn('Prisma news delete warning (read-only environment), deleted in-memory:', error);
    }
    return true;
  }
}
