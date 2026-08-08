import { IProductRepository } from '@/domain/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';

export class ProductService {
  private readonly productRepository: IProductRepository;

  // Dependency Injection (DI)
  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  public async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  public async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategory(categoryId);
  }

  public async getFeaturedProducts(): Promise<Product[]> {
    return this.productRepository.findFeatured();
  }

  public async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim().length === 0) {
      return this.getAllProducts();
    }
    return this.productRepository.search(query.trim());
  }

  public async createProduct(product: Product): Promise<Product> {
    return this.productRepository.create(product);
  }

  public async updateProduct(product: Product): Promise<Product> {
    return this.productRepository.update(product);
  }

  public async deleteProduct(id: string): Promise<boolean> {
    return this.productRepository.delete(id);
  }
}
