import type { HydratedDocument, Types } from "mongoose";
import type { Pet } from "./model";
import PetModel from "./model";
import UserCollection from "../user/collection";
import {coins, health, feed, foodNeeded} from "../common/util"

class PetCollection {
  /**
   * Get all available pets sorted by alphabetical order
   */
  static async getAllPets(): Promise<HydratedDocument<Pet>[]> {
    const pets = await PetModel.find() ?? [];
    const userIds = await Promise.all(pets.map(pet => pet.userId));
    const users = await Promise.all(userIds.map(UserCollection.findOneByUserId));
    const usernames = await Promise.all(users.map(user => user?.username));

    const indices = Array.from(usernames.keys());
    indices.sort((i1, i2) => usernames[i1]! < usernames[i2]! ? -1: 1);
    const sortedPets = indices.map(i => pets[i]);
    return sortedPets;
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
    const itemsOn = {"duckColor": '', "beakColor": '', "hatColor": ''};
    const pet = new PetModel({ userId, petName, lastFed, health, itemsOn });
    await pet.save();
    return pet;
  }

  /**
   * Deletes an existing pet
   */
  static async deleteOne(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
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

  /**
   * Updates health for pet
   */
  static async updateHealth(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const newHealth = health(pet!.lastFed, pet!.healthAfterLastFeed); //todo fix after changing util
    pet!.health = newHealth;
    await pet!.save();
    return pet!;
  }

  //todo decrease all pets by 5 up to min health

  /**
   * Updates items on for pet
   */
  static async updateItemOn(
    userId: Types.ObjectId | string,
    label: string,
    itemId: Types.ObjectId | string
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const updatedItemsOn = pet!.itemsOn;
    updatedItemsOn[label] = itemId;
    pet!.itemsOn = updatedItemsOn;
    await pet!.save();
    return pet!;
  }

  /**
   * Updates last feed date
   */
  static async updateLastFeed( //maybe also need to updateHealth differently 
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const newDate = new Date();
    pet!.lastFed = newDate;
    await pet!.save();
    return pet!;
  }

  /**
   * Feed pet (Updates health after feed)
   */
   static async feedPet(
    userId: Types.ObjectId | string,
    feedAmount: number
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const newHealth = feed(pet!.lastFed, pet!.healthAfterLastFed, feedAmount); 
    pet!.health = newHealth;
    pet!.healthAfterLastFed = newHealth
    const newDate = new Date();
    pet!.lastFed = newDate;
    await pet!.save();
    return pet!;
  }

  // need check for last feeding to see if it is past week to update health
}

export default PetCollection;
