import type { HydratedDocument, Types } from "mongoose";
import type { User } from "./model";
import UserModel from "./model";
import { getRandomUsername } from "./util";

class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} email - The email of the user
   * @param {string} username - the username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(
    email: string,
    password: string
  ): Promise<HydratedDocument<User>> {
    const username = await getRandomUsername();
    const user = new UserModel({ email, password, username });
    await user.save(); // Saves user to MongoDB
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<User> | null> {
    return UserModel.findById(userId);
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(
    username: string
  ): Promise<HydratedDocument<User> | null> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, "i"),
    });
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} email - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByEmailAndPassword(
    email: string,
    password: string
  ): Promise<HydratedDocument<User> | null> {
    return UserModel.findOne({
      email: new RegExp(`^${email.trim()}$`, "i"),
      password,
    });
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({ _id: userId });
    return user !== null;
  }
}

export default UserCollection;
