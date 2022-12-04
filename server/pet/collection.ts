import type { HydratedDocument, Types } from "mongoose";
import type { Pet } from "./model";
import PetModel from "./model";
import UserCollection from "../user/collection";
// import {updateHealth, feed} from "../common/util"
import { healthAfterFeed } from "../common/util";

const HEALTH_HIT = 5;
class PetCollection {
  /**
   * Get all available pets sorted by alphabetical order
   */
  static async getAllPets(): Promise<HydratedDocument<Pet>[]> {
    const pets = await PetModel.find().populate("userId");
    return pets;
  }

  /**
   * Create a new pet
   */
  static async addOne(
    userId: Types.ObjectId | string,
    petName: string
  ): Promise<HydratedDocument<Pet>> {
    const lastFed = new Date();
    const health = 100;
    const itemsOn = {
      duck: "yellow",
      beak: "orange",
      hat: "red",
    };
    const pet = new PetModel({ userId, petName, lastFed, health, itemsOn });
    await pet.save();
    return pet;
  }

  /**
   * Deletes an existing pet
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const pet = await PetModel.deleteOne({ userId: userId });
    return pet !== null;
  }

  /**
   * Gets pet by username (case insensitive)
   */
  static async findOneByUsername(
    username: string
  ): Promise<HydratedDocument<Pet>> {
    const user = await UserCollection.findOneByUsername(username);
    const userId = user!._id;
    const pet = await PetModel.findOne({ userId });
    return pet!;
  }

  static async findById(userId: string): Promise<HydratedDocument<Pet> | null> {
    return PetModel.findOne({ userId });
  }

  static async updateName(userId: string, petName: string) {
    await PetModel.findOneAndUpdate({ userId }, { petName });
  }

  /**
   * Updates health for pet
   */
  static async decrementAllHealth() {
    const pets = await PetModel.find();
    let count = 0;
    for (const pet of pets) {
      pet.health = Math.max(0, pet.health - HEALTH_HIT);
      await pet.save();
      count++;
    }
    return count;
  }

  // /**
  //  * Updates health for pet (designed to be called once daily)
  //  */
  // static async updateHealth(
  //   userId: Types.ObjectId | string
  // ): Promise<HydratedDocument<Pet>> {
  //   const pet = await PetModel.findOne({ userId: userId });
  //   const newHealth = updateHealth(pet!.health);
  //   pet!.health = newHealth;
  //   await pet!.save();
  //   return pet!;
  // }

  /**
   * Updates items on for pet
   */
  static async updateItemOn(
    userId: Types.ObjectId | string,
    label: string,
    value: Types.ObjectId | string
  ) {
    const pet = await PetModel.findOne({ userId });
    if (!pet) return;
    pet.itemsOn = { ...pet.itemsOn, [label]: value };
    await pet.save();
  }

  /**
   * Feed Pet
   */
  static async feed(
    //maybe also need to updateHealth differently
    userId: Types.ObjectId | string,
    feedAmount: number
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const newDate = new Date();
    pet!.lastFed = newDate;
    const newHealth = healthAfterFeed(pet!.health, feedAmount);
    pet!.health = newHealth;
    await pet!.save();
    await UserCollection.updateCoins(userId, -15 * feedAmount); //subtract cost of food of 15
    return pet!;
  }

  /**
   * Calculate how much food to feed based on num of coins and health
   */
  static async calculateAmount(
    userId: Types.ObjectId | string,
    foodPrice: number
  ): Promise<number> {
    const pet = await PetModel.findOne({ userId: userId });
    const user = await UserCollection.findOneByUserId(userId);
    const currHealth = pet!.health;
    let feedAmount = Math.min(5, 100 - currHealth);

    if (feedAmount * foodPrice > user!.coins) {
      //can only buy amount of food that user can afford
      feedAmount = Math.max(Math.floor(user!.coins / foodPrice), 0);
    }

    return feedAmount;
  }

  /**
   * Checking to make sure the duck is not overfed
   */
  static async isOverfed(
    userId: Types.ObjectId | string,
    foodAmount: number
  ): Promise<boolean> {
    const pet = await PetModel.findOne({ userId: userId });
    if (pet!.health + foodAmount > 100) {
      return true;
    }

    return false;
  }
}

export default PetCollection;
