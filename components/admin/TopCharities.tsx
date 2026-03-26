import { prisma } from "@/lib/prisma";

export async function TopCharities() {
  const charities = await prisma.charity.findMany({
    take: 5,
    orderBy: { selections: { _count: "desc" } },
    include: { _count: { select: { selections: true } } },
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Top Charities by Supporters
      </h2>
      <div className="space-y-3">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="flex justify-between items-center py-2 border-b border-border last:border-0"
          >
            <div>
              <p className="text-sm font-medium">{charity.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                {charity.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">
                {charity._count.selections}
              </p>
              <p className="text-xs text-muted-foreground">
                supporters
              </p>
            </div>
          </div>
        ))}
        {charities.length === 0 && (
          <p className="text-muted-foreground text-sm">No charities yet.</p>
        )}
      </div>
    </div>
  );
}