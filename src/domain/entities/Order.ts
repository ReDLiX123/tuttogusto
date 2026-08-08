export type OrderStatus = 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

export class OrderItem {
  private readonly _id: string;
  private readonly _productId: string;
  private readonly _productTitle: string;
  private readonly _quantity: number;
  private readonly _price: number;

  constructor(props: { id: string; productId: string; productTitle: string; quantity: number; price: number }) {
    this._id = props.id;
    this._productId = props.productId;
    this._productTitle = props.productTitle;
    this._quantity = props.quantity;
    this._price = props.price;
  }

  get id(): string { return this._id; }
  get productId(): string { return this._productId; }
  get productTitle(): string { return this._productTitle; }
  get quantity(): number { return this._quantity; }
  get price(): number { return this._price; }
  get subtotal(): number { return this._price * this._quantity; }
}

export class Order {
  private readonly _id: string;
  private _customerName: string;
  private _phone: string;
  private _address?: string;
  private _comments?: string;
  private _status: OrderStatus;
  private _totalAmount: number;
  private _items: OrderItem[];
  private readonly _createdAt: Date;

  constructor(props: {
    id: string;
    customerName: string;
    phone: string;
    address?: string;
    comments?: string;
    status?: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._customerName = props.customerName;
    this._phone = props.phone;
    this._address = props.address;
    this._comments = props.comments;
    this._status = props.status ?? 'NEW';
    this._totalAmount = props.totalAmount;
    this._items = props.items;
    this._createdAt = props.createdAt ?? new Date();
  }

  get id(): string { return this._id; }
  get customerName(): string { return this._customerName; }
  get phone(): string { return this._phone; }
  get address(): string | undefined { return this._address; }
  get comments(): string | undefined { return this._comments; }
  get status(): OrderStatus { return this._status; }
  get totalAmount(): number { return this._totalAmount; }
  get items(): ReadonlyArray<OrderItem> { return this._items; }
  get createdAt(): Date { return this._createdAt; }

  public updateStatus(newStatus: OrderStatus): void {
    this._status = newStatus;
  }
}
