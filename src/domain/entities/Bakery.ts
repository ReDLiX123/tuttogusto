import { Product, ProductConstructorProps } from './Product';

export class Bakery extends Product {
  constructor(props: ProductConstructorProps) {
    super({ ...props, type: 'BAKERY' });
  }

  public override getFormattedBadge(): string {
    return '🥐 Свежая выпечка';
  }
}
