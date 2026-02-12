import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

import connectDB from "./configs/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";
import UserRouter from "./routes/userRoutes.js";

// Session typing
declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}

await connectDB();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    name: "thumblify.sid",
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Server is Live!");
});

// ✅ FIXED LINE
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRouter);
app.use("/api/user", UserRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
