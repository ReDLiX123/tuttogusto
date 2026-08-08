import { Product, ProductConstructorProps } from './Product';
import { Dish } from './Dish';
import { Drink } from './Drink';
import { Bakery } from './Bakery';

export class ProductFactory {
  public static create(props: {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    type: string;
    weightVolume?: string | null;
    prepTime?: number | null;
    discount?: number | null;
    isAvailable?: boolean;
    isFeatured?: boolean;
    categoryId: string;
  }): Product {
    const cleanProps: ProductConstructorProps = {
      id: props.id,
      title: props.title,
      description: props.description,
      price: props.price,
      image: props.image,
      weightVolume: props.weightVolume ?? undefined,
      prepTime: props.prepTime ?? undefined,
      discount: props.discount ?? 0,
      isAvailable: props.isAvailable ?? true,
      isFeatured: props.isFeatured ?? false,
      categoryId: props.categoryId,
    };

    switch (props.type.toUpperCase()) {
      case 'DISH':
        return new Dish(cleanProps);
      case 'DRINK':
        return new Drink(cleanProps);
      case 'BAKERY':
        return new Bakery(cleanProps);
      default:
        return new Dish(cleanProps);
    }
  }
}
