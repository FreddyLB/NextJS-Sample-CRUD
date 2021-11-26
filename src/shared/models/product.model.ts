export interface IProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
