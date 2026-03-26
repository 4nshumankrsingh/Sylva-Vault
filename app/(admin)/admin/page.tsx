import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/admin/StatsCards";
import { RecentDraws } from "@/components/admin/RecentDraws";
import { TopCharities } from "@/components/admin/TopCharities";

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") redirect("/dashboard");

  // Aggregate stats
  const [
    totalUsers,
    activeSubscribers,
    totalPrizePool,
    totalCharityContributions,
    totalWinners,
    pendingVerifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.prizePool.aggregate({ _sum: { totalAmount: true } }),
    prisma.charitySelection.aggregate({ _sum: { contributionPercent: true } }), // Need to calculate actual contributions
    prisma.winner.count(),
    prisma.winner.count({ where: { verificationStatus: "PENDING" } }),
  ]);

  // Calculate actual charity contributions (simplified: 10% of subscription fees)
  const monthlySubs = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "MONTHLY" },
  });
  const yearlySubs = await prisma.subscription.count({
    where: { status: "ACTIVE", plan: "YEARLY" },
  });
  const totalSubscriptionRevenue =
    monthlySubs * 9.99 + yearlySubs * 99.99;
  const estimatedCharityContributions = totalSubscriptionRevenue * 0.1; // assuming min 10%

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage users, draws, charities, and winners.
        </p>
      </div>

      <StatsCards
        totalUsers={totalUsers}
        activeSubscribers={activeSubscribers}
        totalPrizePool={totalPrizePool._sum.totalAmount || 0}
        charityContributions={estimatedCharityContributions}
        totalWinners={totalWinners}
        pendingVerifications={pendingVerifications}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <RecentDraws />
        <TopCharities />
      </div>
    </div>
  );
}