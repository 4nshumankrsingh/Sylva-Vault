import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { runOfficialDraw } from "@/lib/drawEngine";

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
  if (!dbUser || dbUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { month, year, type } = await request.json();

  const existing = await prisma.draw.findUnique({
    where: { month_year: { month, year } },
  });
  if (existing?.status === "PUBLISHED") {
    return NextResponse.json(
      { error: "Draw already published for this month" },
      { status: 409 }
    );
  }

  try {
    const result = await runOfficialDraw(month, year, type ?? "RANDOM");
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Draw failed" }, { status: 500 });
  }
}