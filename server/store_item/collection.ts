import type { HydratedDocument, Types } from "mongoose";
import type { Item } from "./model";
import ItemModel from "./model";

class ItemCollection {
  /**
   * Add a purchased item
   * 
   * @param {string} userId - the current user's id
   * @param {string} item - the item being purchased
   * @return {Promise<HydratedDocument<Item>>} - The newly created purchase
   */
  static async addOne(
    userId: Types.ObjectId | string,
    item: string
  ): Promise<HydratedDocument<Item>> {
    const purchased = new ItemModel({ userId, storeItem: item });
    await purchased.save();
    return purchased;
  }
  
  /**
   * Find all items purchased by user
   * 
   * @param {string} userId - the current user's id
   * @return {Promise<Array<HydratedDocument<Item>>>} - The list of items purchased by the user
   */
  static async findItemsById(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Item>[]> {
    return ItemModel.find({userId: userId});
  }
}

export default ItemCollection;
