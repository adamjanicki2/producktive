import type { Request, Response, NextFunction } from "express";
import UserCollection from "../user/collection";


const FOOD_PRICE = 15;
/**
 * Checks if user has enough too purchase food
 */
const hasEnoughCoins = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId((req.session as any).userId as string);
  const currCoins = user!.coins;
  if (FOOD_PRICE > currCoins) {
    res.status(406).json({
      error: "You do not have enough coins to feed your duck"
    });
    return;
  }
}

export {
  hasEnoughCoins
}