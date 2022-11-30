import type { Request, Response } from "express";
import express from "express";
import PetCollection from "./collection";
import * as userValidator from "../user/middleware";
import * as middleware from "../common/middleware";

const router = express.Router();

//gets all pets in alphabetical order
router.get(
  "/",
  [
    userValidator.isUserLoggedIn,
  ],
  async(req: Request, res: Response) => {
    const pets = await PetCollection.getAllPets();
    return res.status(200).json(pets);
  }
);

//get by username
router.get(
  "/",
  async(req: Request, res: Response) => {
    
  }
)