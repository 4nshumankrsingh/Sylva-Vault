"use server";

import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { simulateDraw, runOfficialDraw } from "@/lib/drawEngine";
import { revalidatePath } from "next/cache";

export async function simulateDrawAction(month: number, year: number, type: "RANDOM" | "ALGORITHMIC") {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  const rollover = await getRollover();
  const result = await simulateDraw(month, year, type, rollover);
  return result;
}

export async function publishDrawAction(month: number, year: number, type: "RANDOM" | "ALGORITHMIC") {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!adminUser || adminUser.role !== "ADMIN") throw new Error("Forbidden");

  const existing = await prisma.draw.findUnique({
    where: { month_year: { month, year } },
  });
  if (existing?.status === "PUBLISHED") {
    throw new Error("Draw already published for this month");
  }

  const result = await runOfficialDraw(month, year, type);
  revalidatePath("/admin/draws");
  return result;
}

async function getRollover() {
  const prevDraw = await prisma.draw.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { prizePool: true },
  });
  return prevDraw?.prizePool?.jackpotRollover ?? 0;
}