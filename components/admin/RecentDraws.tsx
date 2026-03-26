import { prisma } from "@/lib/prisma";

export async function RecentDraws() {
  const draws = await prisma.draw.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { prizePool: true },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Recent Draws
      </h2>
      <div className="space-y-3">
        {draws.map((draw) => (
          <div
            key={draw.id}
            className="flex justify-between items-center py-2 border-b border-border last:border-0"
          >
            <div>
              <p className="text-sm font-medium">
                {draw.month}/{draw.year}
              </p>
              <p className="text-xs text-muted-foreground">
                {draw.status} · {draw.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                ${draw.prizePool?.totalAmount.toFixed(2) ?? "0"}
              </p>
              <p className="text-xs text-muted-foreground">
                pool
              </p>
            </div>
          </div>
        ))}
        {draws.length === 0 && (
          <p className="text-muted-foreground text-sm">No draws yet.</p>
        )}
      </div>
    </div>
  );
}