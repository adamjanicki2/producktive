import type { HydratedDocument, Types } from "mongoose";
import type { List } from "./model";
import ListModel from "./model";

export default class ListCollection {
  static async addOne(
    userId: Types.ObjectId | string,
    title: string
  ): Promise<HydratedDocument<List>> {
    const list = new ListModel({ userId, title });
    await list.save();
    return list;
  }

  static async findOnebyListId(
    listId: Types.ObjectId | string
  ): Promise<HydratedDocument<List> | null> {
    return ListModel.findById(listId);
  }

  static async findByUserId(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<List>[]> {
    return ListModel.find({ userId });
  }

  static async updateTitle(
    listId: Types.ObjectId | string,
    title: string
  ): Promise<HydratedDocument<List> | null> {
    const list = await ListModel.findById(listId);
    if (list) {
      list.title = title;
      await list.save();
    }
    return list;
  }

  static async deleteOne(listId: Types.ObjectId | string): Promise<Boolean> {
    const list = await ListModel.deleteOne({ _id: listId });
    return list !== null;
  }
}
