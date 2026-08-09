import { Cart } from '@/domain/entities/Cart';

export class PricingService {
  public calculateSubtotal(cart: Cart): number {
    return cart.getTotalAmount();
  }

  public calculateDeliveryFee(_subtotal: number): number {
    return 0; // Pickup in cafe is always 100% free
  }

  public calculateTotal(cart: Cart, promoDiscountPercent: number = 0): number {
    const subtotal = this.calculateSubtotal(cart);
    const promoDiscount = Math.round((subtotal * promoDiscountPercent) / 100);
    return Math.max(0, subtotal - promoDiscount);
  }

  public getFreeDeliveryRemaining(_subtotal: number): number {
    return 0;
  }
}
