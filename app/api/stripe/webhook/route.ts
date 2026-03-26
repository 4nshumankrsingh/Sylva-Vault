import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig  = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sub);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata   = session.metadata as Record<string, string> | null;
  const userId     = metadata?.userId;
  const plan       = metadata?.plan as "MONTHLY" | "YEARLY" | undefined;
  const customerId = session.customer as string;
  const subId      = session.subscription as string;

  if (!userId || !plan) return;

  // Retrieve subscription to get period end
  const stripeSub  = await stripe.subscriptions.retrieve(subId);
  // current_period_end lives on the first item in Stripe v17
  const periodEnd  = (stripeSub as unknown as { current_period_end: number }).current_period_end;

  await prisma.subscription.upsert({
    where:  { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubId:      subId,
      plan,
      status:           "ACTIVE",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubId:      subId,
      plan,
      status:           "ACTIVE",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data:  { role: "SUBSCRIBER" },
  });
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubId: sub.id },
  });
  if (!existing) return;

  const status =
    sub.status === "active"   ? "ACTIVE"    :
    sub.status === "canceled" ? "CANCELLED" :
    sub.status === "past_due" ? "LAPSED"    : "INACTIVE";

  // current_period_end moved in v17 — access via cast
  const raw      = sub as unknown as { current_period_end?: number };
  const periodEnd = raw.current_period_end;

  await prisma.subscription.update({
    where: { stripeSubId: sub.id },
    data: {
      status,
      currentPeriodEnd:  periodEnd ? new Date(periodEnd * 1000) : null,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubId: sub.id },
  });
  if (!existing) return;

  await prisma.subscription.update({
    where: { stripeSubId: sub.id },
    data:  { status: "CANCELLED" },
  });

  await prisma.user.update({
    where: { id: existing.userId },
    data:  { role: "PUBLIC" },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // In Stripe v17 the invoice object shape changed — subscription is nested.
  // The official Stripe type may not include invoice.subscription; fallback to invoice.lines.
  const invoiceSubscription = (invoice as unknown as {
    subscription?: string | Stripe.Subscription | null;
  }).subscription;

  const nestedLineSubscription = invoice.lines?.data
    .find((line) => line.subscription)
    ?.subscription as string | undefined;

  const subId =
    typeof invoiceSubscription === "string"
      ? invoiceSubscription
      : invoiceSubscription && typeof invoiceSubscription === "object"
      ? invoiceSubscription.id
      : nestedLineSubscription;

  if (!subId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubId: subId },
    data:  { status: "LAPSED" },
  });
}