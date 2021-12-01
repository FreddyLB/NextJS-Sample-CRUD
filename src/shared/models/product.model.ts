import { ITag } from "./tag.model";

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  tags: ITag[];
  createdAt: Date;
  updatedAt: Date;
}
