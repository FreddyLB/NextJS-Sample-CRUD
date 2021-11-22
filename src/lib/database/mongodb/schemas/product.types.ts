import { Model, Document } from "mongoose";
import { IProduct } from "src/shared/models/product.model";

export interface ProductDocument extends IProduct, Document {
    id: string;
}

export interface ProductModel extends Model<ProductDocument> {}
