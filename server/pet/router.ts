import type { Request, Response } from "express";
import express from "express";
import PetCollection from "./collection";
import * as userValidator from "../user/middleware";

const router = express.Router();

//creation of new pet happens in user creation
//deletion of pet happens in user deletion

//get pet by username
router.get(
  "/:username",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const pet = await PetCollection.findOneByUsername(req.params.username);
    return res.status(200).json(pet);
  }
);

//gets all pets in alphabetical order
router.get(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const pets = await PetCollection.getAllPets();
    return res.status(200).json(pets);
  }
);

//update last feed
router.patch(
  "/updateFeed",
  [
    userValidator.isUserLoggedIn,
    //maybe need to check if they have valid amount of food for feeding
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const pet = await PetCollection.updateLastFeed(userId);
    return res.status(200).json(pet);
  }
);

//update items on
router.patch(
  "/updateItem",
  [
    userValidator.isUserLoggedIn,
    //need check if have valid item in closet
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const label = req.body.label;
    const itemId = req.body.itemId;
    const pet = await PetCollection.updateItemOn(userId, label, itemId);
    return res.status(200).json(pet);
  }
);

export { router as petRouter };
