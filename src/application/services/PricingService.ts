import { Cart } from '@/domain/entities/Cart';

export class PricingService {
  private readonly FREE_DELIVERY_THRESHOLD = 1500; // Free delivery over 1500 RUB
  private readonly STANDARD_DELIVERY_FEE = 200; // Delivery fee 200 RUB

  public calculateSubtotal(cart: Cart): number {
    return cart.getTotalAmount();
  }

  public calculateDeliveryFee(subtotal: number): number {
    if (subtotal === 0 || subtotal >= this.FREE_DELIVERY_THRESHOLD) {
      return 0;
    }
    return this.STANDARD_DELIVERY_FEE;
  }

  public calculateTotal(cart: Cart, promoDiscountPercent: number = 0): number {
    const subtotal = this.calculateSubtotal(cart);
    const promoDiscount = Math.round((subtotal * promoDiscountPercent) / 100);
    const deliveryFee = this.calculateDeliveryFee(subtotal - promoDiscount);
    return Math.max(0, subtotal - promoDiscount + deliveryFee);
  }

  public getFreeDeliveryRemaining(subtotal: number): number {
    if (subtotal >= this.FREE_DELIVERY_THRESHOLD) return 0;
    return this.FREE_DELIVERY_THRESHOLD - subtotal;
  }
}
