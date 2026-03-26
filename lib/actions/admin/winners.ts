"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { sendVerificationEmail, sendPaymentEmail } from "@/lib/actions/notifications";

export async function verifyWinnerAction(
  winnerId: string,
  status: "APPROVED" | "REJECTED"
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  const winner = await prisma.winner.update({
    where: { id: winnerId },
    data: { verificationStatus: status },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  // Send verification result email
  await sendVerificationEmail({
    to: winner.user.email,
    userName: winner.user.name ?? winner.user.email.split("@")[0],
    matchCount: winner.matchCount,
    prizeAmount: winner.prizeAmount,
    status,
  });

  revalidatePath("/admin/winners");
}

export async function markPaidAction(winnerId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  const winner = await prisma.winner.update({
    where: { id: winnerId },
    data: { paymentStatus: "PAID" },
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  // Send payment confirmation email
  await sendPaymentEmail({
    to: winner.user.email,
    userName: winner.user.name ?? winner.user.email.split("@")[0],
    prizeAmount: winner.prizeAmount,
    matchCount: winner.matchCount,
  });

  revalidatePath("/admin/winners");
}