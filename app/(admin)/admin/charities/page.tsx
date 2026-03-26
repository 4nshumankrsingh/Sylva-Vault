import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CharityList } from "@/components/admin/CharityList";
import { CreateCharityButton } from "@/components/admin/CreateCharityButton";

export default async function AdminCharitiesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  const charities = await prisma.charity.findMany({
    include: { _count: { select: { selections: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Charity Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage charities supported by users.
          </p>
        </div>
        <CreateCharityButton />
      </div>

      <CharityList charities={charities} />
    </div>
  );
}