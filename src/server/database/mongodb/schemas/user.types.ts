import { IUser } from "@shared/models/user.model";
import { Model, Document } from "mongoose";

export interface UserModel extends Model<UserDocument> {}

export interface UserDocument extends IUser, Document {
  id: string;
}
