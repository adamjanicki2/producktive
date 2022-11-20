import express, { Request, Response } from "express";
import session from "express-session";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import * as dotenv from "dotenv";
import cors from "cors";
import MongoStore from "connect-mongo";
import { OK } from "../server/util";

dotenv.config();

// some constants
const MONGO_URL = process.env.MONGO_SRV;
if (!MONGO_URL) {
  throw new Error("MONGO_SRV is not defined in .env file!");
}

// MongoDB connection using Mongoose
const mongoClient = mongoose
  .connect(MONGO_URL)
  .then((mongo) => {
    console.log("Connected to MongoDB database.");
    return mongo.connection.getClient();
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB database: ${error}`);
    throw new Error(error.message);
  });

const app = express();

app.use(express.json());
app.use(cors());
app.set("port", process.env.PORT ?? 8000);

// sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "secret",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: mongoClient,
      dbName: "sessions",
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
  })
);

// Add sub routers here:
// app.use(API_PREFIX + "/announcement", announcementRouter);
app.get("/", (req: Request, res: Response) => {
  return res.status(OK).json({ message: "Hello World" });
});

const buildDir = path.resolve(__dirname, "..", "client", "build");
const indexDir = path.join(buildDir, "index.html");

// Build directory
app.use(express.static(buildDir));

// Serve index.html for all other routes
app.get("*", (req: Request, res: Response) => {
  res.status(OK).sendFile(indexDir);
});

const server = http.createServer(app);

server.listen(app.get("port"), () => {
  console.log(`Server running on port: ${app.get("port")}`);
});
