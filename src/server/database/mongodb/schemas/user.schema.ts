import mongoose, { Schema } from "mongoose";
import { UserDocument, UserModel } from "./user.types";

const userSchema = new Schema<UserDocument, UserModel>(
  {
    userId: {
      type: String,
      immutable: true,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      immutable: true,
      required: true,
      default: () => new Date(),
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
);

// Extensions
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const User: UserModel =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
