import { model, Schema } from "mongoose";
import * as Mongoose from "mongoose";
import { ProductDocument, ProductModel } from "./product.types";

const ProductShema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.01,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Product: ProductModel =
  Mongoose.models.Product ||
  model<ProductDocument, ProductModel>("Product", ProductShema);
  
export default Product;
