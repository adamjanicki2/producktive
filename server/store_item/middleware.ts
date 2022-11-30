import type { Request, Response, NextFunction } from "express";
import ItemCollection from "./collection";

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

export {
    isAlreadyPurchased,
    isInStock
};