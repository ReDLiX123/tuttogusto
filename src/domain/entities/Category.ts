export class Category {
  private readonly _id: string;
  private _slug: string;
  private _name: string;
  private _sortOrder: number;

  constructor(props: { id: string; slug: string; name: string; sortOrder?: number }) {
    this._id = props.id;
    this._slug = props.slug;
    this._name = props.name;
    this._sortOrder = props.sortOrder ?? 0;
  }

  get id(): string { return this._id; }
  get slug(): string { return this._slug; }
  get name(): string { return this._name; }
  get sortOrder(): number { return this._sortOrder; }
}
