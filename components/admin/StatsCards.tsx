"use client";

import { Users, CreditCard, Gift, Heart, Award, Clock } from "lucide-react";

interface StatsCardsProps {
  totalUsers: number;
  activeSubscribers: number;
  totalPrizePool: number;
  charityContributions: number;
  totalWinners: number;
  pendingVerifications: number;
}

export function StatsCards({
  totalUsers,
  activeSubscribers,
  totalPrizePool,
  charityContributions,
  totalWinners,
  pendingVerifications,
}: StatsCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Active Subscribers",
      value: activeSubscribers.toLocaleString(),
      icon: CreditCard,
      color: "bg-green-500/10 text-green-500",
    },
{
  title: "Prize Pool",
  value: `£${totalPrizePool.toFixed(2)}`,
  icon: Gift,
  color: "bg-purple-500/10 text-purple-500",
},
{
  title: "Charity Contributions",
  value: `£${charityContributions.toFixed(2)}`,
  icon: Heart,
  color: "bg-red-500/10 text-red-500",
},
    {
      title: "Total Winners",
      value: totalWinners.toLocaleString(),
      icon: Award,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Pending Verifications",
      value: pendingVerifications.toLocaleString(),
      icon: Clock,
      color: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-card border border-border rounded-xl p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground">{card.title}</p>
        </div>
      ))}
    </div>
  );
}