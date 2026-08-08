export type ProductType = 'DISH' | 'DRINK' | 'BAKERY';

export interface ProductProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  type: ProductType;
  weightVolume?: string;
  prepTime?: number;
  discount?: number;
  isAvailable?: boolean;
  isFeatured?: boolean;
  categoryId: string;
}

export type ProductConstructorProps = Omit<ProductProps, 'type'>;

export abstract class Product {
  private readonly _id: string;
  private _title: string;
  private _description: string;
  private _price: number;
  private _image: string;
  private _type: ProductType;
  private _weightVolume?: string;
  private _prepTime?: number;
  private _discount: number;
  private _isAvailable: boolean;
  private _isFeatured: boolean;
  private _categoryId: string;

  constructor(props: ProductProps) {
    if (props.price < 0) {
      throw new Error('Product price cannot be negative');
    }
    this._id = props.id;
    this._title = props.title;
    this._description = props.description;
    this._price = props.price;
    this._image = props.image;
    this._type = props.type;
    this._weightVolume = props.weightVolume;
    this._prepTime = props.prepTime;
    this._discount = props.discount ?? 0;
    this._isAvailable = props.isAvailable ?? true;
    this._isFeatured = props.isFeatured ?? false;
    this._categoryId = props.categoryId;
  }

  // Getters
  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get price(): number { return this._price; }
  get image(): string { return this._image; }
  get type(): ProductType { return this._type; }
  get weightVolume(): string | undefined { return this._weightVolume; }
  get prepTime(): number | undefined { return this._prepTime; }
  get discount(): number { return this._discount; }
  get isAvailable(): boolean { return this._isAvailable; }
  get isFeatured(): boolean { return this._isFeatured; }
  get categoryId(): string { return this._categoryId; }

  // Encapsulated Business Methods
  public getFinalPrice(): number {
    if (this._discount > 0) {
      return Math.max(0, Math.round(this._price * (1 - this._discount / 100)));
    }
    return this._price;
  }

  public updatePrice(newPrice: number): void {
    if (newPrice < 0) throw new Error('Price cannot be negative');
    this._price = newPrice;
  }

  public setAvailability(available: boolean): void {
    this._isAvailable = available;
  }

  public setDiscount(discountPercent: number): void {
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount must be between 0 and 100');
    }
    this._discount = discountPercent;
  }

  // Polymorphic method to be implemented by child classes
  public abstract getFormattedBadge(): string;

  // Convert to plain object for React Server Component (RSC) boundary passing
  public toPlainObject(): ProductProps & { finalPrice: number; badgeText: string } {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      price: this._price,
      finalPrice: this.getFinalPrice(),
      image: this._image,
      type: this._type,
      weightVolume: this._weightVolume,
      prepTime: this._prepTime,
      discount: this._discount,
      isAvailable: this._isAvailable,
      isFeatured: this._isFeatured,
      categoryId: this._categoryId,
      badgeText: this.getFormattedBadge(),
    };
  }
}
