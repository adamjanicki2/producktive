import type { Types } from "mongoose";
import { Schema, model } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  notifPeriod: "daily" | "weekly" | "monthly" | "none";
  coins: number;
};

const UserSchema = new Schema({
  // The user's username
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  // The user's password
  password: {
    type: String,
    required: true,
  },
  // The user's notification period
  notifPeriod: {
    type: String,
    required: true,
    default: "daily",
  },
  // The user's coins
  coins: {
    type: Number,
    required: true,
  },
});

const UserModel = model<User>("User", UserSchema);
export default UserModel;
