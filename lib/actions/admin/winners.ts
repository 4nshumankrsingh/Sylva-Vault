"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function verifyWinnerAction(winnerId: string, status: "APPROVED" | "REJECTED") {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.winner.update({
    where: { id: winnerId },
    data: { verificationStatus: status },
  });

  revalidatePath("/admin/winners");
}

export async function markPaidAction(winnerId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.winner.update({
    where: { id: winnerId },
    data: { paymentStatus: "PAID" },
  });

  revalidatePath("/admin/winners");
}