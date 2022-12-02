import type { Request, Response, NextFunction } from "express";
import UserCollection from "../user/collection";
import ItemCollection from "./collection";

const PRICES = {
  "food": 15,
  "beak": 500,
  "duck": 650,
} as const;

/**
 * Checks to make sure the same item is not being purchased twice except for food
 */
const isAlreadyPurchased = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.type !== "food"){
    if(ItemCollection.findByIdentifier((req.session as any).userId as string, req.body.identifier) !== null) {
        res.status(402).json({
            error: 'You have already purchased this item'
        });
        return;
    }
  }
};

/**
 * Checks if user has item in stock
 */
const isInStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const exists = await ItemCollection.findByIdentifier((req.session as any).userId as string, req.body.identifier);
  if(!exists){
    res.status(404).json({
      error: 'You do not have this item in stock'
    });
    return;
  }
};

/**
 * checks if the user has enough coins to purchase the item
 */
const hasEnoughCoins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId((req.session as any).userId as string);
  const currCoins = user!.coins;
  const cost = PRICES[req.body.type as string];
  if (cost > currCoins) {
    res.status(406).json({
      error: "You do not have enough coins to purchase this item"
    });
    return;
  }
}

export {
    isAlreadyPurchased,
    isInStock,
    hasEnoughCoins
};