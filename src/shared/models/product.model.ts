export interface IProduct {
  id: string;
  name: string;
  description?: string;
  color: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
