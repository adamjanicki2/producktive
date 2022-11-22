import type { HydratedDocument } from "mongoose";
import axios from "axios";
import type { User } from "./model";

// Update this if you add a property to the User type!
type UserResponse = {
  _id: string;
  username: string;
  email: string;
  notifPeriod: "daily" | "weekly" | "monthly" | "none";
};

/**
 * Transform a raw User object from the database into an object
 * with all the information needed by the frontend
 * (in this case, removing the password for security)
 *
 * @param {HydratedDocument<User>} user - A user object
 * @returns {UserResponse} - The user object without the password
 */
export const constructUserResponse = (
  user: HydratedDocument<User>
): UserResponse => {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    notifPeriod: user.notifPeriod,
  };
};

export const getRandomUsername = async (): Promise<string> => {
  const { data } = await axios.get("https://randomuser.me/api/");
  return data.results[0].login.username;
};
