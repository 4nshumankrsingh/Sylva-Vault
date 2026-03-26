import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  MONTHLY: {
    id:          "monthly",
    name:        "Monthly",
    price:       9.99,
    interval:    "month" as const,
    priceId:     process.env.STRIPE_MONTHLY_PRICE_ID!,
    description: "Billed every month",
    charityMin:  10,
  },
  YEARLY: {
    id:          "yearly",
    name:        "Yearly",
    price:       99.99,
    interval:    "year" as const,
    priceId:     process.env.STRIPE_YEARLY_PRICE_ID!,
    description: "Billed annually — 2 months free",
    charityMin:  10,
  },
} as const;

export type PlanKey = keyof typeof PLANS;