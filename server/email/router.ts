import type { Request, Response } from "express";
import UserCollection from "../user/collection";
import TaskCollection from "../task/collection";
import { User } from "../user/model";
import express from "express";
import sendEmail, { constructEmail } from "./util";
import * as emailMiddleware from "./middleware";

const router = express.Router();

router.get(
  "/:period",
  [emailMiddleware.isNotifPeriodValid, emailMiddleware.verifyAPIKey],
  async (req: Request, res: Response) => {
    const period = req.params.period;
    const users = await UserCollection.findByNotifPeriod(
      period as User["notifPeriod"]
    );
    let userCount = 0;
    for (const user of users) {
      const tasks = await TaskCollection.getUpcomingTasks(
        user._id,
        user.notifPeriod
      );
      if (tasks.length > 0) {
        userCount++;
        const html = constructEmail(user, tasks);
        await sendEmail(user.email, "Quack!", html);
      }
    }
    return res.status(200).json({ emailsSent: userCount });
  }
);

export { router as emailRouter };
