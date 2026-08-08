import { Product, ProductConstructorProps } from './Product';

export class Drink extends Product {
  constructor(props: ProductConstructorProps) {
    super({ ...props, type: 'DRINK' });
  }

  public override getFormattedBadge(): string {
    if (this.weightVolume) {
      return `☕ ${this.weightVolume}`;
    }
    return '☕ Напиток';
  }
}
