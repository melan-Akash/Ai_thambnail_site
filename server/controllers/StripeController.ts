import { Request, Response } from "express";
import stripe from "../configs/stripe.js";
import User from "../models/User.js";
import { sendPaymentEmail } from "../services/emailService.js";

// Pricing Plans mapping
const plans = {
  "basic": {
    price: 0,
    credits: 5,
    name: "Basic"
  },
  "pro": {
    price: 3,
    credits: 100,
    name: "Pro"
  },
  "enterprise": {
    price: 5,
    credits: 500,
    name: "Enterprise"
  }
};

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.session;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { planId } = req.body;
    const plan = plans[planId as keyof typeof plans];

    if (!plan) {
      res.status(400).json({ message: "Invalid plan" });
      return;
    }

    // Handle Free Plan directly without Stripe
    if (plan.price === 0) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if (user.freePlanClaimed) {
        res.status(400).json({ message: "You have already claimed the free plan credits." });
        return;
      }
      user.credits += plan.credits;
      user.freePlanClaimed = true;
      await user.save();
      res.json({ message: "Free plan activated! 5 credits added.", isFree: true, credits: user.credits });
      return;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Plan - ${plan.credits} Credits`,
            },
            unit_amount: plan.price * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/?payment=success`,
      cancel_url: `${clientUrl}/?payment=cancelled`,
      metadata: {
        userId: userId.toString(),
        credits: plan.credits.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Failed to create checkout session" });
  }
};

export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers["stripe-signature"] as string;
  let event;

  try {
    // The raw body is required for signature verification
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "" // Note: Needs to be added to .env
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    // Ignore verification if webhook secret is not set, just for local testing if needed
    // But ideally, STRIPE_WEBHOOK_SECRET must be present.
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
       console.log("No webhook secret configured, skipping signature verification for local testing.");
       event = req.body;
    } else {
       res.status(400).send(`Webhook Error: ${err.message}`);
       return;
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;
    const creditsStr = session.metadata?.credits;

    if (userId && creditsStr) {
      const credits = parseInt(creditsStr, 10);
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { $inc: { credits: credits } },
          { new: true }
        );
        console.log(`Successfully added ${credits} credits to user ${userId}`);
        if (user) {
          sendPaymentEmail(user.email, user.name, credits === 100 ? "Pro" : "Enterprise", credits);
        }
      } catch (dbError) {
        console.error("Database Error updating user credits:", dbError);
      }
    }
  }

  res.json({ received: true });
};
