import mongoose, { Schema } from "mongoose";
import { TagModel, TagDocument } from "./tag.types";

export const tagSchema = new Schema<TagDocument, TagModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
    },
    color: {
      type: String,
      trim: true,
      default: "red",
    },
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
tagSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Tag: TagModel =
  mongoose.models.Tag ||
  mongoose.model<TagDocument, TagModel>("Tag", tagSchema);

export default Tag;
