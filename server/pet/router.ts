import type { Request, Response } from "express";
import express from "express";
import PetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";

const router = express.Router();

//creation of new pet happens in user creation
//deletion of pet happens in user deletion

//gets all pets in alphabetical order
router.get(
  "/",
  [
    userValidator.isUserLoggedIn,
  ],
  async(req: Request, res: Response) => {
    const pets = await PetCollection.getAllPets();
    return res.status(200).json(pets);
  }
);

//get pet by username
router.get(
  "/",
  [
    userValidator.isUserLoggedIn,
    userValidator.isUsernameExists
  ],
  async(req: Request, res: Response) => {
    const pet = await PetCollection.findOneByUsername(req.query.username as string);
    return res.status(200).json(pet);
  }
);

//update last feed 
router.patch(
  "/updateFeed",
  [
    userValidator.isUserLoggedIn
    //maybe need to check if they have valid amount of food for feeding
  ],
  async(req: Request, res: Response) => {
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
 async(req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const label = req.body.label;
    const itemId = req.body.itemId;
    const pet = await PetCollection.updateItemOn(userId, label, itemId);
    return res.status(200).json(pet);
 }
)



