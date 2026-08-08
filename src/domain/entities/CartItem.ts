import { Product } from './Product';

export class CartItem {
  private readonly _product: Product;
  private _quantity: number;

  constructor(product: Product, quantity: number = 1) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    this._product = product;
    this._quantity = quantity;
  }

  get product(): Product { return this._product; }
  get quantity(): number { return this._quantity; }

  public increment(amount: number = 1): void {
    this._quantity += amount;
  }

  public decrement(amount: number = 1): void {
    if (this._quantity - amount < 1) {
      throw new Error('Quantity cannot be less than 1');
    }
    this._quantity -= amount;
  }

  public setQuantity(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0');
    this._quantity = quantity;
  }

  public getSubtotal(): number {
    return this._product.getFinalPrice() * this._quantity;
  }
}
