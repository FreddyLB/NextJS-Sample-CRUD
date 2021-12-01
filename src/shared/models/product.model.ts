import { ITag } from "./tag.model";
import { IUser } from "./user.model";

export interface IProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  tags: ITag[];
  user: IUser;
  createdAt: Date;
  updatedAt: Date;
}
