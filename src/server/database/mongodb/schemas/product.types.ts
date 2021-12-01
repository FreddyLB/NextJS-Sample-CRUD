import { Model, Document } from "mongoose";
import { IProduct } from "src/shared/models/product.model";
import { UserDocument } from "./user.types";

export interface ProductDocument extends IProduct, Document {
    id: string;
    user: UserDocument;
}

export interface ProductModel extends Model<IProduct> {}
