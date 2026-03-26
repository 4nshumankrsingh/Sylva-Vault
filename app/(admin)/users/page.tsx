import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UserTable } from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    include: {
      subscription: true,
      scores: {
        orderBy: { datePlayed: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View, edit, and manage users, their scores, and subscriptions.
        </p>
      </div>

      <UserTable users={users} />
    </div>
  );
}