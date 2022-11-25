import type { Types } from "mongoose";
import { Schema, model } from "mongoose";

export type List = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
};

const ListSchema = new Schema({
  //the user who made the list
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  //the title of the list
  title: {
    type: String,
    required: true,
  },
});

export default model<List>("List", ListSchema);
