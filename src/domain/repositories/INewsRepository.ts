import { News } from '../entities/News';

export interface INewsRepository {
  findAll(publishedOnly?: boolean): Promise<News[]>;
  findById(id: string): Promise<News | null>;
  create(news: News): Promise<News>;
  update(news: News): Promise<News>;
  delete(id: string): Promise<boolean>;
}
