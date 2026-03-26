import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DrawConfig } from "@/components/admin/DrawConfig";
import { DrawHistory } from "@/components/admin/DrawHistory";

export default async function AdminDrawsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  const draws = await prisma.draw.findMany({
    orderBy: { createdAt: "desc" },
    include: { prizePool: true, winners: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Draw Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure, simulate, and publish monthly draws.
        </p>
      </div>

      <DrawConfig />
      <DrawHistory draws={draws} />
    </div>
  );
}