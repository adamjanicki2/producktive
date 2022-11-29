import type { Types } from "mongoose";
import { Schema, model } from "mongoose";

export type Item = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  storeItem: string;
}

const ItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  storeItem: {
    type: String,
    required: true
  }
});

const ItemModel = model<Item>("Item", ItemSchema);
export default ItemModel;
