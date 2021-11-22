import { Model, Document } from "mongoose";
import { IProduct } from "./models/product.model";

export interface ProductDocument extends IProduct, Document {}

export interface ProductModel extends Model<ProductDocument> {}
