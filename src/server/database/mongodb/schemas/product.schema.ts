import { model, Schema } from "mongoose";
import * as Mongoose from "mongoose";
import { ProductDocument, ProductModel } from "./product.types";

const ProductShema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
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
      validate: (value: number) => value > 0,
    },
    createdAt: {
      type: Date,
      imageUrl: true,
      required: true,
      default: () => Date.now(),
    },
    updatedAt: {
      type: Date,
      required: true,
      default: () => Date.now(),
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

// Extensions
ProductShema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Product: ProductModel =
  Mongoose.models.Product ||
  model<ProductDocument, ProductModel>("Product", ProductShema);

export default Product;
