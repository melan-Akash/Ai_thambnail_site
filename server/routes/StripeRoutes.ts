import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/StripeController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);

// Note: webhook needs raw body parsing, which should be configured in server.ts
// Usually handled via express.raw({type: 'application/json'}) for this specific route.

export default router;
