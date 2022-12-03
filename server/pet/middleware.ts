import type { Request, Response, NextFunction } from "express";
import UserCollection from "../user/collection";
import PetModel from "./model";
import {foodNeeded} from "../common/util"

const FOOD_PRICE = 15;
/**
 * Checks if user has enough too purchase food
 */
const hasEnoughCoins = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId(
    (req.session as any).userId
  );
  const currCoins = user!.coins;
  if (FOOD_PRICE * req.body.feedAmount > currCoins) {
    res.status(406).json({
      error: "You do not have enough coins to feed your duck"
    });
    return;
  }

  next();
};

/**
 * Checks if user is attempting to overfeed duck
 */
 const notOverfeed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
const user = await UserCollection.findOneByUserId(
  (req.session as any).userId
);
const pet = await PetModel.findOne({ userId: user });
let petHealth = 100;
if (pet?.health){
  petHealth = pet?.health;
}
if (req.body.feedAmount > foodNeeded(petHealth)) {
  res.status(406).json({
    error: "You can't overfeed your duck!"
  });
  return;
}

next();
};

/**
 * Checks if valid pet name
 */
 const validPetName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
const {petName} = req.body as {petName: string};
if (!petName.trim()) {
  res.status(400).json({
    error: "Pet name must be at least one character long"
  });
  return;
}

next();
};

export {
  hasEnoughCoins,
  notOverfeed,
  validPetName
}