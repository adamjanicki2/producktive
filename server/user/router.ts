import type { Request, Response, NextFunction } from "express";
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
 * @param {string} password - user's password
 * @param {string} email - user's email
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If email is already taken
 * @throws {400} - If password or email is not in correct format
 *
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidEmail,
    userValidator.isValidPassword,
    userValidator.isEmailNotAlreadyInUse,
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

/**
 * Update a user's information
 *
 * @param {string} username - the user's new username
 * @param {string} password - the user's new password
 * @param {string} email - the user's new email
 * @param {string} period - the user's new notificaiton period
 * @return {UserResponse} - The updated user
 * @throws {403} - If the user is not logged in
 * @throws {400} - if the username, email, or password is in the wrong format
 * @throws {409} - if the username or email is already in use
 * @throws {406} - if the period is not a valid option
 */
router.patch(
  "/",
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isValidEmail,
    userValidator.isValidPassword,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isEmailNotAlreadyInUse,
    userValidator.isValidPeriod,
  ],
  async (req: Request, res: Response) => {
    const userId = ((req.session as any).userId as string) ?? "";
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: "Your profile was updated successfully",
      user: util.constructUserResponse(user),
    });
  }
);

/**
 * Get a user's pet
 *
 * @return {Image} - the current image of that user's pet
 * @throws {403} - if the user is not logged in
 * @throws {404} - if username is not a valid username
 *
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username !== undefined) {
      next();
      return;
    }
  },
  [userValidator.isUserLoggedIn, userValidator.isUsernameNotAlreadyInUse],
  async (req: Request, res: Response) => {
    //functions to get return image
  }
);

export { router as userRouter };
