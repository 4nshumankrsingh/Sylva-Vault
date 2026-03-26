import { prisma } from "@/lib/prisma";
import { Heart, ExternalLink, Star, Calendar } from "lucide-react";

export const metadata = { title: "Charities" };

export default async function CharitiesPage() {
  const charities = await prisma.charity.findMany({
    where:   { active: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    include: {
      events: {
        where:   { eventDate: { gte: new Date() } },
        orderBy: { eventDate: "asc" },
        take:    2,
      },
    },
  });

  const featured = charities.filter((c: any) => c.featured);
  const rest     = charities.filter((c: any) => !c.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-x-0 top-16 h-72 -z-10 bg-mesh-gradient opacity-40" />

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-14">

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-up">
          <p className="text-sm font-medium text-primary tracking-widest uppercase">Giving Back</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Charities we support
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every subscription contributes to the cause you choose. A minimum of 10% of your subscription fee goes directly to your selected charity.
          </p>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">Featured</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
              {featured.map((charity: any, i: number) => (
                <div
                  key={charity.id}
                  className="card-elevated p-7 space-y-5 animate-fade-up relative overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-xl text-foreground">{charity.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{charity.description}</p>
                    </div>
                  </div>

                  {charity.events.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Upcoming Events</p>
                      {charity.events.map((ev: any) => (
                        <div key={ev.id} className="flex items-center gap-2.5 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{ev.title}</span>
                          <span className="text-muted-foreground ml-auto shrink-0">
                            {new Date(ev.eventDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Min. contribution: <strong className="text-primary">10%</strong>
                    </span>
                    {charity.website && (
                      <a href={charity.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Website <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All charities */}
        {rest.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-widest">All Charities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {rest.map((charity: any, i: number) => (
                <div
                  key={charity.id}
                  className="card-elevated p-6 space-y-4 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{charity.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">{charity.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Min. <strong className="text-primary">10%</strong>
                    </span>
                    {charity.website && (
                      <a href={charity.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {charities.length === 0 && (
          <div className="text-center py-20 space-y-3">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto" />
            <p className="text-muted-foreground">Charities will appear here once added by an admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}