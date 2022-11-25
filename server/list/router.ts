import type { Request, Response } from "express";
import express from "express";
import ListCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";

const router = express.Router();

router.get(
  "/:listId",
  [middleware.isInfoValidId("params", ["listId"])],
  async (req: Request, res: Response) => {
    const { listId } = req.params;
    const list = await ListCollection.findOnebyListId(listId);
    if (!list) {
      return res.status(404).json({ error: "List could not be found." });
    }
    return res.status(200).json(list);
  }
);

router.post(
  "/",
  [userValidator.isUserLoggedIn, middleware.isInfoSupplied("body", ["title"])],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const { title } = req.body;
    const list = await ListCollection.addOne(userId, title as string);
    return res.status(201).json(list);
  }
);

router.patch(
  "/:listId",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoValidId("params", ["listId"]),
    middleware.isInfoSupplied("body", ["title"]),
  ],
  async (req: Request, res: Response) => {
    const { listId } = req.params;
    const list = await ListCollection.updateTitle(
      listId,
      req.body.title as string
    );
    return res.status(200).json(list);
  }
);

router.delete(
  "/:listId",
  [middleware.isInfoValidId("params", ["listId"])],
  async (req: Request, res: Response) => {
    const { listId } = req.params;
    const list = await ListCollection.deleteOne(listId);
    if (!list) {
      return res.status(404).json({ error: "List could not be deleted" });
    }
    return res.status(200).json({ deleted: true });
  }
);

export { router as listRouter };
