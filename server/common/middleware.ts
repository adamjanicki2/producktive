import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

type RequestInformation = "params" | "body" | "query";

/**
 * Check if the appropriate params are supplied to endpoints
 *
 * @param reqInfoType either params or query or body
 * @param fields the fields to check if they exist
 * @returns a callback to use as middleware
 */
export const isInfoSupplied = (
  reqInfoType: RequestInformation,
  fields: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!information[field]) {
        return res.status(400).json({
          error: `'${field}' required`,
        });
      }
    }
    next();
  };
};

/**
 * Check if the appropriate params are valid mongo ids
 *
 * @param reqInfoType either params or query or body
 * @param fields the fields to check if they are valid ids
 * @returns a callback to use as middleware
 */
export const isInfoValidId = (
  reqInfoType: RequestInformation,
  fields: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!Types.ObjectId.isValid(information[field])) {
        return res.status(400).json({
          error: `field '${field}' is not a valid 12-byte Mongo ID in req.${reqInfoType}`,
        });
      }
    }
    next();
  };
};
