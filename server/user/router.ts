import type { Request, Response } from "express";
import express from "express";
import UserCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as util from "./util";

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  "/session",
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isValidPassword,
    userValidator.isAccountExists,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByEmailAndPassword(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(401).json({ error: "Unable to create user session" });
    }
    (req.session as any).userId = user._id.toString();
    res.status(201).json({
      message: "You have logged in successfully",
      user: util.constructUserResponse(user),
    });
  }
);

router.get("/tempy", (req, res) => {
  res.json({ session: req.session });
});

router.get("/setSession", (req, res) => {
  (req.session as any).userId = "HAHAHAHA";
  res.json({ msg: "session set" });
});

router.get("/clearSession", (req, res) => {
  (req.session as any).userId = undefined;
  res.json({ msg: "session cleared" });
});

router.get("/session", async (req: Request, res: Response) => {
  if (!(req.session as any).userId) {
    return res.status(401).json({ error: "You are not logged in." });
  }
  const user = await UserCollection.findOneByUserId(
    (req.session as any).userId
  );
  if (!user) {
    return res.status(401).json({ error: "You are not logged in." });
  }
  return res.status(200).json({ user: util.constructUserResponse(user) });
});

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  "/session",
  [userValidator.isUserLoggedIn],
  (req: Request, res: Response) => {
    (req.session as any).userId = undefined;
    res.status(200).json({
      message: "You have been logged out successfully.",
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isValidPassword,
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.addOne(req.body.email, req.body.password);
    (req.session as any).userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user),
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userId = ((req.session as any).userId as string) ?? "";
    await UserCollection.deleteOne(userId);
    (req.session as any).userId = undefined;
    res.status(200).json({
      message: "Your account has been deleted successfully.",
    });
  }
);

export { router as userRouter };
