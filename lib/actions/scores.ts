"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addScore(value: number, datePlayed: Date) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  if (value < 1 || value > 45) throw new Error("Score must be between 1 and 45");

  const count = await prisma.score.count({ where: { userId: dbUser.id } });

  if (count >= 5) {
    const oldest = await prisma.score.findFirst({
      where:   { userId: dbUser.id },
      orderBy: { datePlayed: "asc" },
    });
    if (oldest) await prisma.score.delete({ where: { id: oldest.id } });
  }

  await prisma.score.create({
    data: { userId: dbUser.id, value, datePlayed },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteScore(scoreId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  const score = await prisma.score.findFirst({
    where: { id: scoreId, userId: dbUser.id },
  });
  if (!score) throw new Error("Score not found");

  await prisma.score.delete({ where: { id: scoreId } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getUserScores() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) return [];

  return prisma.score.findMany({
    where:   { userId: dbUser.id },
    orderBy: { datePlayed: "desc" },
    take:    5,
  });
}