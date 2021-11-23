export interface IProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  color: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
