export class News {
  private readonly _id: string;
  private _title: string;
  private _content: string;
  private _image: string;
  private _isPublished: boolean;
  private readonly _createdAt: Date;

  constructor(props: {
    id: string;
    title: string;
    content: string;
    image: string;
    isPublished?: boolean;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._title = props.title;
    this._content = props.content;
    this._image = props.image;
    this._isPublished = props.isPublished ?? true;
    this._createdAt = props.createdAt ?? new Date();
  }

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get content(): string { return this._content; }
  get image(): string { return this._image; }
  get isPublished(): boolean { return this._isPublished; }
  get createdAt(): Date { return this._createdAt; }

  public toPlainObject() {
    return {
      id: this._id,
      title: this._title,
      content: this._content,
      image: this._image,
      isPublished: this._isPublished,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
