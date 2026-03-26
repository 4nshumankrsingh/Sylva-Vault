import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { ScoreEntryForm } from "@/components/forms/ScoreEntryForm";
import { CharitySelector } from "@/components/forms/CharitySelector";
import {
  Trophy,
  Heart,
  Target,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  CreditCard,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

async function getDashboardData(supabaseId: string) {
  return prisma.user.findUnique({
    where:   { supabaseId },
    include: {
      subscription:     true,
      scores:           { orderBy: { datePlayed: "desc" }, take: 5 },
      charitySelection: { include: { charity: true } },
      winnings:         { include: { draw: true }, orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
}

function StatusBadge({ status }: { status: string | undefined }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE:    { label: "Active",    color: "#0a7c4d", bg: "rgba(10,122,77,0.1)"  },
    INACTIVE:  { label: "Inactive",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    CANCELLED: { label: "Cancelled", color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
    LAPSED:    { label: "Lapsed",    color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  };
  const s = status ? map[status] : null;
  if (!s) return <span className="text-xs text-muted-foreground">No plan</span>;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await getDashboardData(user.id);
  if (!dbUser) redirect("/login");

  const charities    = await prisma.charity.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  const isSubscriber = dbUser.subscription?.status === "ACTIVE";
  const totalWon     = dbUser.winnings.reduce((acc, w) => acc + w.prizeAmount, 0);

  const now      = new Date();
  const nextDraw = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysLeft = Math.ceil((nextDraw.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-x-0 top-16 h-64 -z-10 bg-mesh-gradient opacity-40" />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-up">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Welcome back</p>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {dbUser.name ?? user.email?.split("@")[0]}
            </h1>
          </div>
          {!isSubscriber && (
            <a
              href="/subscribe"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "0 2px 10px color-mix(in srgb, var(--primary) 30%, transparent)" }}
            >
              <Trophy className="w-4 h-4" />
              Subscribe to Play
            </a>
          )}
        </div>

        {/* Inactive subscription warning */}
        {!isSubscriber && (
          <div
            className="flex items-start gap-4 p-5 rounded-2xl border animate-fade-up"
            style={{
              borderColor: "color-mix(in srgb, #f59e0b 40%, var(--border))",
              background:  "color-mix(in srgb, #f59e0b 6%, var(--card-bg))",
            }}
          >
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">No active subscription</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Subscribe to enter monthly draws, track scores, and support your charity.
              </p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {[
            {
              label: "Subscription",
              value: <StatusBadge status={dbUser.subscription?.status} />,
              icon:  CreditCard,
              sub:   dbUser.subscription?.plan
                ? `${dbUser.subscription.plan.charAt(0) + dbUser.subscription.plan.slice(1).toLowerCase()} plan`
                : "No plan",
            },
            {
              label: "Scores Entered",
              value: <span className="text-2xl font-display font-bold text-foreground">{dbUser.scores.length}/5</span>,
              icon:  Target,
              sub:   "Stableford scores",
            },
            {
              label: "Next Draw",
              value: <span className="text-2xl font-display font-bold text-foreground">{daysLeft}d</span>,
              icon:  Calendar,
              sub:   nextDraw.toLocaleDateString("en-GB", { day: "numeric", month: "long" }),
            },
            {
              label: "Total Won",
              value: <span className="text-2xl font-display font-bold text-foreground">£{totalWon.toFixed(2)}</span>,
              icon:  Trophy,
              sub:   `${dbUser.winnings.length} prize${dbUser.winnings.length !== 1 ? "s" : ""}`,
            },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="card-elevated p-5 space-y-3 animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div>{value}</div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-elevated p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground">Score Management</h2>
            </div>
            <div className="rule-gradient" />
            <ScoreEntryForm
              scores={dbUser.scores.map(s => ({ ...s, datePlayed: new Date(s.datePlayed) }))}
              canAdd={isSubscriber}
            />
          </div>

          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground">Your Charity</h2>
            </div>
            <div className="rule-gradient" />
            <CharitySelector
              charities={charities}
              current={dbUser.charitySelection ? {
                charityId:           dbUser.charitySelection.charityId,
                contributionPercent: dbUser.charitySelection.contributionPercent,
                charity:             dbUser.charitySelection.charity,
              } : null}
              canChange={isSubscriber}
            />
          </div>
        </div>

        {/* Draw participation & winnings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground">Draw Participation</h2>
            </div>
            <div className="rule-gradient" />

            {isSubscriber && dbUser.scores.length >= 3 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Entered in next draw</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your numbers: {dbUser.scores.map(s => s.value).join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  Draw runs on 1st {nextDraw.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Target className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  {!isSubscriber
                    ? "Subscribe to enter the monthly draw"
                    : `Add ${3 - dbUser.scores.length} more score${3 - dbUser.scores.length !== 1 ? "s" : ""} to qualify`
                  }
                </p>
              </div>
            )}
          </div>

          <div className="card-elevated p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display font-semibold text-foreground">Winnings</h2>
            </div>
            <div className="rule-gradient" />

            {dbUser.winnings.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Trophy className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">No winnings yet — keep playing!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dbUser.winnings.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card">
                    <div>
                      <p className="text-sm font-medium text-foreground">{w.matchCount}-Number Match</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(w.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">£{w.prizeAmount.toFixed(2)}</p>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          color:      w.paymentStatus === "PAID" ? "#0a7c4d" : "#f59e0b",
                          background: w.paymentStatus === "PAID" ? "rgba(10,122,77,0.1)" : "rgba(245,158,11,0.1)",
                        }}
                      >
                        {w.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Manage subscription */}
        {isSubscriber && (
          <div className="card-elevated p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-up">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Manage Subscription</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Renews{" "}
                {dbUser.subscription?.currentPeriodEnd
                  ? new Date(dbUser.subscription.currentPeriodEnd).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })
                  : "—"
                }
                {dbUser.subscription?.cancelAtPeriodEnd && " · Cancels at period end"}
              </p>
            </div>
            <a
              href="/api/stripe/create-portal"
              className="px-5 py-2 rounded-xl border border-border bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-all"
            >
              Billing Portal
            </a>
          </div>
        )}
      </div>
    </div>
  );
}