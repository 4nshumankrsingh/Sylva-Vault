import { prisma } from "@/lib/prisma";
import { Trophy, Calendar, TrendingUp, Users, ChevronRight } from "lucide-react";

export const metadata = { title: "Monthly Draws" };

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default async function DrawsPage() {
  const draws = await prisma.draw.findMany({
    where:   { status: "PUBLISHED" },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    include: {
      prizePool: true,
      winners:   { include: { user: { select: { name: true } } } },
      entries:   { select: { id: true } },
    },
    take: 12,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-x-0 top-16 h-72 -z-10 bg-mesh-gradient opacity-40" />

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-up">
          <p className="text-sm font-medium text-primary tracking-widest uppercase">Results</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">Monthly Draws</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Draws run on the 1st of every month. Match 3, 4, or all 5 numbers to win your share of the prize pool.
          </p>
        </div>

        {/* Prize tier breakdown */}
        <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
          {[
            { match: "5 Numbers", share: "40%", note: "Jackpot — rolls over if unclaimed" },
            { match: "4 Numbers", share: "35%", note: "Split equally among winners"      },
            { match: "3 Numbers", share: "25%", note: "Split equally among winners"      },
          ].map(({ match, share, note }) => (
            <div key={match} className="card-elevated p-5 text-center space-y-2">
              <div className="text-2xl font-display font-bold text-gradient">{share}</div>
              <div className="text-sm font-medium text-foreground">{match}</div>
              <div className="text-xs text-muted-foreground">{note}</div>
            </div>
          ))}
        </div>

        {/* Draw history */}
        {draws.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground">
              No draws published yet. Check back after the 1st of next month.
            </p>
          </div>
        ) : (
          <div className="space-y-5 stagger">
            {draws.map((draw: any, i: number) => {
              const fiveWinners  = draw.winners.filter((w: any) => w.matchCount === 5);
              const fourWinners  = draw.winners.filter((w: any) => w.matchCount === 4);
              const threeWinners = draw.winners.filter((w: any) => w.matchCount === 3);
              const jackpotRolled = fiveWinners.length === 0;

              return (
                <div
                  key={draw.id}
                  className="card-elevated p-6 space-y-5 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Draw header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display font-semibold text-foreground">
                          {MONTHS[draw.month - 1]} {draw.year}
                        </h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {draw.publishedAt
                            ? new Date(draw.publishedAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                              })
                            : "—"
                          }
                          <span className="mx-1">·</span>
                          <Users className="w-3 h-3" />
                          {draw.entries.length} entries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: draw.type === "ALGORITHMIC"
                            ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                            : "color-mix(in srgb, var(--primary) 12%, transparent)",
                          color: draw.type === "ALGORITHMIC" ? "var(--accent)" : "var(--primary)",
                        }}
                      >
                        {draw.type === "ALGORITHMIC" ? "Algorithmic" : "Random"}
                      </span>
                      {draw.prizePool && (
                        <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
                          £{draw.prizePool.totalAmount.toFixed(2)} pool
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Drawn numbers */}
                  <div className="flex flex-wrap gap-2">
                    {draw.drawnNumbers.map((n: any, idx: number) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-display font-bold text-white"
                        style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                      >
                        {n}
                      </div>
                    ))}
                  </div>

                  {/* Pool breakdown */}
                  {draw.prizePool && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "5-Match", amount: draw.prizePool.fiveMatchAmount  },
                        { label: "4-Match", amount: draw.prizePool.fourMatchAmount  },
                        { label: "3-Match", amount: draw.prizePool.threeMatchAmount },
                      ].map(({ label, amount }) => (
                        <div key={label} className="p-3 rounded-xl bg-muted space-y-1">
                          <div className="text-sm font-bold text-foreground">£{amount.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Winners */}
                  <div className="space-y-2">
                    {jackpotRolled && (
                      <div
                        className="flex items-center gap-2 p-3 rounded-xl"
                        style={{
                          background:  "color-mix(in srgb, var(--accent) 8%, transparent)",
                          border:      "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                        }}
                      >
                        <TrendingUp className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} />
                        <span className="text-sm text-foreground">
                          Jackpot rolls over — £{draw.prizePool?.fiveMatchAmount.toFixed(2)} added to next draw
                        </span>
                      </div>
                    )}

                    {[
                      { list: fiveWinners,  label: "5-Match", prize: draw.prizePool?.fiveMatchAmount  },
                      { list: fourWinners,  label: "4-Match", prize: draw.prizePool?.fourMatchAmount  },
                      { list: threeWinners, label: "3-Match", prize: draw.prizePool?.threeMatchAmount },
                    ].map(({ list, label, prize }) =>
                      list.length > 0 ? (
                        <div
                          key={label}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-primary" />
                            <span className="font-medium text-foreground">
                              {label} Winner{list.length > 1 ? "s" : ""}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">
                              {list.map((w: any) => w.user.name ?? "Anonymous").join(", ")}
                            </span>
                          </div>
                          {prize && (
                            <span className="font-bold text-primary">
                              £{(prize / list.length).toFixed(2)} each
                            </span>
                          )}
                        </div>
                      ) : null
                    )}

                    {draw.winners.length === 0 && !jackpotRolled && (
                      <p className="text-sm text-muted-foreground text-center py-2">No winners this draw</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}