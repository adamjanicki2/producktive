import type { Request, Response, NextFunction } from "express";
// import ListModel from "./model";

// /**
//  * Checks to ensure that the given list name does not exist
//  */
// const isAlreadyExists = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = (req.session as any).userId;
//   const { title } = req.body;
//   const list = await ListModel.findOne({ title: title.trim(), userId });
//   if(list) {
//     res.status(401).json({
//       error: "This list name already exists"
//     });
//     return;
//   }
//   next();
// };

/**
 * Checks to make sure the name is not blank
 */
const isValidTitle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const title = req.body.title;
  if(title.trim() === ""){
    res.status(402).json({
        error: "The list name cannot be blank"
    });
    return;
  }
  next();
};

export {
  isValidTitle
}