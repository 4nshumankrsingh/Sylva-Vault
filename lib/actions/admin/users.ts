"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// ── Guard helper — reuse across all actions ───────────────────────────────────
async function requireAdmin() {
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
}

// ── Update role in BOTH Prisma AND Supabase user_metadata ────────────────────
// This is the critical function — middleware reads role from Supabase metadata,
// so both must always stay in sync.
export async function setUserRole(
  userId: string,
  role: "PUBLIC" | "SUBSCRIBER" | "ADMIN"
) {
  await requireAdmin();

  // 1. Update role in Prisma
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  // 2. Sync role into Supabase user_metadata using service/admin client
  const supabase = await createServiceClient();
  const { error } = await supabase.auth.admin.updateUserById(
    updatedUser.supabaseId,
    {
      user_metadata: { role },
    }
  );

  if (error) {
    // Role was updated in DB but not in Supabase — throw so admin knows
    throw new Error(
      `Role saved in database but failed to sync to auth system: ${error.message}`
    );
  }

  revalidatePath("/admin/users");
  return updatedUser;
}

// ── Keep old updateUserRole as a wrapper so existing UI doesn't break ─────────
export async function updateUserRole(
  userId: string,
  role: "PUBLIC" | "SUBSCRIBER" | "ADMIN"
) {
  return setUserRole(userId, role);
}

// ── Update subscription status ────────────────────────────────────────────────
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: string
) {
  await requireAdmin();

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: status as any },
  });

  revalidatePath("/admin/users");
}

// ── Add score on behalf of a user (admin only) ────────────────────────────────
export async function addScoreAdmin(
  value: number,
  datePlayed: Date,
  userId: string
) {
  await requireAdmin();

  if (value < 1 || value > 45) throw new Error("Score must be between 1 and 45");

  const count = await prisma.score.count({ where: { userId } });

  if (count >= 5) {
    const oldest = await prisma.score.findFirst({
      where: { userId },
      orderBy: { datePlayed: "asc" },
    });
    if (oldest) await prisma.score.delete({ where: { id: oldest.id } });
  }

  await prisma.score.create({
    data: { userId, value, datePlayed },
  });

  revalidatePath("/admin/users");
}

// ── Delete a score (admin only) ───────────────────────────────────────────────
export async function deleteScoreAdmin(scoreId: string, userId: string) {
  await requireAdmin();

  await prisma.score.delete({ where: { id: scoreId } });

  revalidatePath("/admin/users");
}