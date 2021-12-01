import { ITag } from "@shared/models/tag.model";
import { Model, Document } from "mongoose";

export interface TagModel extends Model<TagDocument> {}

export interface TagDocument extends ITag, Document {
  id: string;
}
