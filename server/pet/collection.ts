import type { HydratedDocument, Types } from "mongoose";
import type { Pet } from "./model";
import PetModel from "./model";
import UserCollection from "../user/collection";

const HEALTH_HIT = 5;
class PetCollection {
  /**
   * Get all available pets sorted by alphabetical order
   */
  static async getAllPets(): Promise<HydratedDocument<Pet>[]> {
    const pets = (await PetModel.find()) ?? [];
    const userIds = await Promise.all(pets.map((pet) => pet.userId));
    const users = await Promise.all(
      userIds.map(UserCollection.findOneByUserId)
    );
    const usernames = await Promise.all(users.map((user) => user?.username));

    const indices = Array.from(usernames.keys());
    indices.sort((i1, i2) => (usernames[i1]! < usernames[i2]! ? -1 : 1));
    const sortedPets = indices.map((i) => pets[i]);
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

  static async decrementAllHealth() {
    const pets = await PetModel.find();
    let count = 0;
    for (const pet of pets) {
      pet.health = Math.max(1, pet.health - HEALTH_HIT);
      await pet.save();
      count++;
    }
    return count;
  }
  /**
   * Updates health for pet
   */
  static async updateHealth(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Pet>> {
    const newHealth = 0; //call health algorithm
    const pet = await PetModel.findOne({ userId: userId });
    pet!.health = newHealth;
    await pet!.save();
    return pet!;
  }

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
   * Updates last feed date
   */
  static async updateLastFeed(
    //maybe also need to updateHealth differently
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Pet>> {
    const pet = await PetModel.findOne({ userId: userId });
    const newDate = new Date();
    pet!.lastFed = newDate;
    await pet!.save();
    return pet!;
  }

  // need check for last feeding to see if it is past week to update health
}

export default PetCollection;
