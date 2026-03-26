import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WinnersTable } from "@/components/admin/WinnersTable";

export default async function AdminWinnersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  const winners = await prisma.winner.findMany({
    include: {
      user: { select: { email: true, name: true } },
      draw: { select: { month: true, year: true, type: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Winners Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Verify winners, upload proof, and mark payouts.
        </p>
      </div>

      <WinnersTable winners={winners} />
    </div>
  );
}