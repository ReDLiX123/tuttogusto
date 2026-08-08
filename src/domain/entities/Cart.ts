import { CartItem } from './CartItem';
import { Product } from './Product';

export class Cart {
  private _items: CartItem[];

  constructor(items: CartItem[] = []) {
    this._items = [...items];
  }

  get items(): ReadonlyArray<CartItem> {
    return this._items;
  }

  public addItem(product: Product, quantity: number = 1): void {
    const existingIndex = this._items.findIndex((item) => item.product.id === product.id);
    if (existingIndex !== -1) {
      this._items[existingIndex].increment(quantity);
    } else {
      this._items.push(new CartItem(product, quantity));
    }
  }

  public removeItem(productId: string): void {
    this._items = this._items.filter((item) => item.product.id !== productId);
  }

  public updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this._items.find((i) => i.product.id === productId);
    if (item) {
      item.setQuantity(quantity);
    }
  }

  public clear(): void {
    this._items = [];
  }

  public getTotalItemsCount(): number {
    return this._items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public getTotalAmount(): number {
    return this._items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }
}
