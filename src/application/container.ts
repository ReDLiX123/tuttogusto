import { PrismaProductRepository } from '@/infrastructure/repositories/PrismaProductRepository';
import { PrismaCategoryRepository } from '@/infrastructure/repositories/PrismaCategoryRepository';
import { PrismaOrderRepository } from '@/infrastructure/repositories/PrismaOrderRepository';
import { PrismaNewsRepository } from '@/infrastructure/repositories/PrismaNewsRepository';
import { ProductService } from './services/ProductService';
import { PricingService } from './services/PricingService';
import { OrderService } from './services/OrderService';
import { NewsService } from './services/NewsService';

// Repositories
const productRepository = new PrismaProductRepository();
const categoryRepository = new PrismaCategoryRepository();
const orderRepository = new PrismaOrderRepository();
const newsRepository = new PrismaNewsRepository();

// Services
export const productService = new ProductService(productRepository);
export const pricingService = new PricingService();
export const orderService = new OrderService(orderRepository, pricingService);
export const newsService = new NewsService(newsRepository);
export const categoryRepo = categoryRepository;
