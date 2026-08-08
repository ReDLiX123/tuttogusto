import { IOrderRepository } from '@/domain/repositories/IOrderRepository';
import { Order, OrderItem, OrderStatus } from '@/domain/entities/Order';
import { Cart } from '@/domain/entities/Cart';
import { PricingService } from './PricingService';

export interface CreateOrderDTO {
  customerName: string;
  phone: string;
  address?: string;
  comments?: string;
  cart: Cart;
}

export class OrderService {
  private readonly orderRepository: IOrderRepository;
  private readonly pricingService: PricingService;

  constructor(orderRepository: IOrderRepository, pricingService: PricingService) {
    this.orderRepository = orderRepository;
    this.pricingService = pricingService;
  }

  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    if (!dto.customerName || !dto.customerName.trim()) {
      throw new Error('Customer name is required');
    }
    if (!dto.phone || !dto.phone.trim()) {
      throw new Error('Phone number is required');
    }
    if (dto.cart.items.length === 0) {
      throw new Error('Cart cannot be empty');
    }

    const totalAmount = this.pricingService.calculateTotal(dto.cart);
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = dto.cart.items.map((cartItem, index) => {
      return new OrderItem({
        id: `ITEM-${orderId}-${index}`,
        productId: cartItem.product.id,
        productTitle: cartItem.product.title,
        quantity: cartItem.quantity,
        price: cartItem.product.getFinalPrice(),
      });
    });

    const newOrder = new Order({
      id: orderId,
      customerName: dto.customerName,
      phone: dto.phone,
      address: dto.address,
      comments: dto.comments,
      status: 'NEW',
      totalAmount,
      items: orderItems,
    });

    return this.orderRepository.create(newOrder);
  }

  public async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  public async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  public async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.orderRepository.updateStatus(id, status);
  }
}
