import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

import connectDB from "./configs/db.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ThumbnailRouter from "./routes/ThumbnailRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import StripeRouter from "./routes/StripeRoutes.js";
import { stripeWebhook } from "./controllers/StripeController.js";
import { sendContactEmail } from "./services/emailService.js";

// Session typing
declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}

await connectDB();

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// We need raw body for Stripe webhook, so define this BEFORE express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
app.use("/api/stripe", StripeRouter);

app.post("/api/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    await sendContactEmail(name, email, message);
    res.json({ message: "Your message has been sent successfully!" });
  } catch (error: any) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
  });
}

export default app;
