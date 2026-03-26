import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await request.json() as { plan: PlanKey };
  const planConfig = PLANS[plan];

  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing  = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });
  let customerId  = existing?.stripeCustomerId ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email:    user.email!,
      name:     user.user_metadata?.full_name ?? undefined,
      metadata: { userId: dbUser.id },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer:   customerId,
    mode:       "subscription",
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true`,
    cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?cancelled=true`,
    metadata:    { userId: dbUser.id, plan },
    subscription_data: {
      metadata: { userId: dbUser.id, plan },
    },
  });

  return NextResponse.json({ url: session.url });
}