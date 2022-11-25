import type { Request, Response } from "express";
import express from "express";
import TaskCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";

const router = express.Router();

router.get("/:listId", async (req: Request, res: Response) => {
  const { listId } = req.params;
  const tasks = await TaskCollection.findByParentId(listId);
  return res.status(200).json(tasks);
});

router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("body", ["listId", "content", "difficulty"]),
    middleware.isInfoValidId("body", ["listId"]),
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const { listId, content, difficulty, date } = req.body;
    const task = await TaskCollection.addOne(
      userId,
      listId,
      content,
      difficulty,
      date
    );
    return res.status(201).json(task);
  }
);

router.patch(
  "/:taskId",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoValidId("params", ["taskId"]),
  ],
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const task = await TaskCollection.updateOne(taskId, req.body);
    return res.status(200).json(task);
  }
);

router.delete(
  "/:taskId",
  [middleware.isInfoValidId("params", ["taskId"])],
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const task = await TaskCollection.deleteOne(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task could not be deleted" });
    }
    return res.status(200).json({ deleted: true });
  }
);

export { router as taskRouter };
