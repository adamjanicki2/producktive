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
    users.forEach((user) => {
      TaskCollection.getUpcomingTasks(user._id, user.notifPeriod).then(
        (tasks) => {
          if (tasks.length > 0) {
            const html = constructEmail(user, tasks);
            sendEmail(user.email, "Quack!", html);
          }
        }
      );
    });
    return res.status(200).json({ success: true });
  }
);

export { router as emailRouter };
