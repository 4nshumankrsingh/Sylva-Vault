"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function selectCharity(charityId: string, contributionPercent: number) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser) throw new Error("User not found");

  if (contributionPercent < 10 || contributionPercent > 100) {
    throw new Error("Contribution must be between 10% and 100%");
  }

  await prisma.charitySelection.upsert({
    where:  { userId: dbUser.id },
    create: { userId: dbUser.id, charityId, contributionPercent },
    update: { charityId, contributionPercent },
  });

  revalidatePath("/dashboard");
  revalidatePath("/charities");
  return { success: true };
}

export async function getAllCharities() {
  return prisma.charity.findMany({
    where:   { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export async function getUserCharitySelection(userId: string) {
  return prisma.charitySelection.findUnique({
    where:   { userId },
    include: { charity: true },
  });
}