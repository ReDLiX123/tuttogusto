import { INewsRepository } from '@/domain/repositories/INewsRepository';
import { News } from '@/domain/entities/News';

export class NewsService {
  private readonly newsRepository: INewsRepository;

  constructor(newsRepository: INewsRepository) {
    this.newsRepository = newsRepository;
  }

  public async getPublishedNews(): Promise<News[]> {
    return this.newsRepository.findAll(true);
  }

  public async getAllNews(): Promise<News[]> {
    return this.newsRepository.findAll(false);
  }

  public async getNewsById(id: string): Promise<News | null> {
    return this.newsRepository.findById(id);
  }

  public async createNews(news: News): Promise<News> {
    return this.newsRepository.create(news);
  }

  public async updateNews(news: News): Promise<News> {
    return this.newsRepository.update(news);
  }

  public async deleteNews(id: string): Promise<boolean> {
    return this.newsRepository.delete(id);
  }
}
