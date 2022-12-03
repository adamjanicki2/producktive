import type { HydratedDocument, Types } from "mongoose";
import type { Item } from "./model";
import ItemModel from "./model";
import UserCollection from "../user/collection";

const PRICES = {
  "food": 15,
  "beak": 500,
  "duck": 650,
} as const;

class ItemCollection {
  /**
   * Add a purchased item
   *
   * @param {string} userId - the current user's id
   * @param {string} type - the item being purchased
   * @param {string} identifier - the item's identifier
   * @param {Record<string, string>} properties - the properties of the item being purchased
   * @return {Promise<HydratedDocument<Item>>} - The newly created purchase
   */
  static async addOne(
    userId: Types.ObjectId | string,
    type: string,
    identifier: string,
    properties: Record<string, string>
  ): Promise<HydratedDocument<Item>> {
    const purchased = new ItemModel({ userId, type, identifier, properties });
    await UserCollection.updateCoins(userId, -1*PRICES[type]); //negative to lose coins
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
    return ItemModel.find({ userId });
  }

  /**
   * Delete item once used (for food)
   */
  static async deleteOne(
    itemId: Types.ObjectId | string
  ): Promise<boolean> {
    const item = await ItemModel.deleteOne({ _id: itemId });
    return item !== null;
  }

  /**
   * Find items by userId and identifier
   */
  static async findByIdentifier(
    userId: Types.ObjectId | string,
    identifier: string
  ): Promise<HydratedDocument<Item> | null> {
    const item = await ItemModel.findOne({userId: userId, identifier: identifier});
    return item;
  }
}

export default ItemCollection;
