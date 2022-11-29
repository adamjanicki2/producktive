import type { Types } from "mongoose";
import { Schema, model } from "mongoose";

export type Item = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: string;
  indentifier: string;
  properties: Record<string, string>;
};

const ItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  properties: {
    type: Object,
    required: true,
  },
});

const ItemModel = model<Item>("Item", ItemSchema);
export default ItemModel;
