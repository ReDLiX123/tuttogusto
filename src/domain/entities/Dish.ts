import { Product, ProductConstructorProps } from './Product';

export class Dish extends Product {
  constructor(props: ProductConstructorProps) {
    super({ ...props, type: 'DISH' });
  }

  public override getFormattedBadge(): string {
    if (this.prepTime) {
      return `🍳 Готовка ~${this.prepTime} мин`;
    }
    return '🍳 Горячее блюдо';
  }
}
