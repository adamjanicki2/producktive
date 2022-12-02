import type { Request, Response } from "express";
import express from "express";
import ItemCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";
import * as ItemValidator from "./middleware";

const router = express.Router();

// gets owned items
router.get(
  "/",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const ownedItems = await ItemCollection.findItemsById(
      (req.session as any).userId as string
    );
    return res.status(200).json(ownedItems);
  }
);

router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("body", ["type", "identifier", "properties"]),
    ItemValidator.isAlreadyPurchased,
  ],
  async (req: Request, res: Response) => {
    const { type, identifier, properties } = req.body;
    const userId = (req.session as any).userId as string;
    const purchasedItem = await ItemCollection.addOne(
      userId,
      type,
      identifier,
      properties
    );
    return res.status(201).json(purchasedItem);
  }
);

export { router as itemRouter };
