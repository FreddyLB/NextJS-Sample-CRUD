import mongoose, { Types, Schema } from "mongoose";
import { ProductDocument, ProductModel } from "./product.types";

const productSchema = new Schema<ProductDocument, ProductModel>(
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
    price: {
      type: Number,
      required: true,
      validate: (value: number) => value > 0,
    },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    createdAt: {
      type: Date,
      immutable: true,
      required: true,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      required: true,
      default: () => new Date(),
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
productSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Product: ProductModel =
  mongoose.models.Product ||
  mongoose.model<ProductDocument, ProductModel>("Product", productSchema);

export default Product;
