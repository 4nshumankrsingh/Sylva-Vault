"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: "PUBLIC" | "SUBSCRIBER" | "ADMIN") {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}

export async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: status as any },
  });

  revalidatePath("/admin/users");
}

// Extend addScore to accept userId for admin
export async function addScoreAdmin(value: number, datePlayed: Date, userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

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

export async function deleteScoreAdmin(scoreId: string, userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  await prisma.score.delete({ where: { id: scoreId } });

  revalidatePath("/admin/users");
}