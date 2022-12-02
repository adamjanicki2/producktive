import type { Request, Response } from "express";
import express from "express";
import PetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../email/middleware";
import * as itemValidator from "../store_item/middleware";
import * as petValidator from "./middleware";

const router = express.Router();

router.get(
  "/decrementHealth",
  [middleware.verifyAPIKey],
  async (req: Request, res: Response) => {
    const numberUpdated = await PetCollection.decrementAllHealth();
    return res.status(200).json({ message: `${numberUpdated} pets hurt!` });
  }
);

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

//Feed Pet
router.patch(
  "/feed",
  [
    userValidator.isUserLoggedIn,
    petValidator.hasEnoughCoins,
    petValidator.notOverfeed
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const pet = await PetCollection.feed(userId, req.body.feedAmount);
    return res.status(200).json({ pet: pet, message: `You successfully fed pet ${req.body.feedAmount}` });
  }
);

//update items on
router.patch(
  "/updateItemsOn",
  [
    userValidator.isUserLoggedIn,
    itemValidator.isInStock
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const { duck, beak } = req.body;
    if (duck) await PetCollection.updateItemOn(userId, "duck", duck);
    if (beak) await PetCollection.updateItemOn(userId, "beak", beak);
    const pet = await PetCollection.findById(userId);
    return res.status(200).json(pet);
  }
);

//update duck name
router.patch(
  "/updateName",
  [
    userValidator.isUserLoggedIn,
    petValidator.validPetName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const { petName } = req.body;
    await PetCollection.updateName(userId, petName);
    return res.status(200).json({ message: "Pet name updated" });
  }
);

// //Daily pet health update
// router.patch(
//   "/updateHealth",
//   [
//     userValidator.isUserLoggedIn,
//   ],
//   async (req: Request, res: Response) => {
//     const userId = (req.session as any).userId as string;
//     const pet = await PetCollection.updateHealth(userId);
//     return res.status(200).json({ pet: pet, message: "Pet Health updated" });
//   }
// );

export { router as petRouter };
