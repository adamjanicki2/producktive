import type { Request, Response } from "express";
import express from "express";
import TaskCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";
import { constructTaskResponse } from "./util";

const router = express.Router();

router.get("/today", async (req: Request, res: Response) => {
  const tasks = await TaskCollection.getUpcomingTasks(
    (req.session as any).userId,
    "daily"
  );
  return res.status(200).json(tasks);
});

router.get("/:listId", async (req: Request, res: Response) => {
  const { listId } = req.params;
  const tasks = await TaskCollection.findByParentId(listId);
  return res.status(200).json(tasks.map(constructTaskResponse));
});

router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoSupplied("body", ["listId", "content", "difficulty", "deadline"]),
    middleware.isInfoValidId("body", ["listId"]),
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const { listId, content, difficulty, deadline } = req.body;
    const task = await TaskCollection.addOne(
      userId,
      listId,
      content,
      difficulty,
      deadline
    );
    return res.status(201).json(constructTaskResponse(task));
  }
);

router.patch("/complete/:taskId", async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = (req.session as any).userId as string;
  const task = await TaskCollection.completeOne(userId, taskId);
  if (!task) return res.status(404).json({ error: "Task not found" });
  return res.status(200).json({ status: "success", coinsDelta: task });
});

router.patch(
  "/:taskId",
  [
    userValidator.isUserLoggedIn,
    middleware.isInfoValidId("params", ["taskId"]),
  ],
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const task = await TaskCollection.updateOne(taskId, req.body);
    return res.status(200).json(constructTaskResponse(task));
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

router.get(
  "/today",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    const userId = (req.session as any).userId as string;
    const tasks = await TaskCollection.getTodayTask(userId);
    return res.status(200).json(tasks.map(constructTaskResponse));
  }
);

export { router as taskRouter };
