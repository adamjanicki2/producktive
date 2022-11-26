import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;

export const isNotifPeriodValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const period = req.params.period;
  if (["daily", "weekly", "monthly"].includes(period)) {
    return next();
  }
  return res.status(400).json({ error: "Invalid notification period" });
};

export const verifyAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!API_KEY) {
    return res.status(401).json({ error: "API key not in server" });
  }
  const key = req.headers["x-api-key"];
  if (key === API_KEY) {
    return next();
  }
  return res.status(401).json({ error: "Invalid API key" });
};
