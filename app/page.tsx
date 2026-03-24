import Link from "next/link";
import { TreePine, ArrowRight, Trophy, Heart, Target } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background text-foreground">
      {/* Background mesh */}
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-40" />

      <div className="text-center max-w-2xl px-6 space-y-8">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <TreePine className="w-6 h-6 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-3xl font-display font-semibold tracking-tight text-foreground">
            Sylva Vault
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
          Coming{" "}
          <span className="text-gradient">
            Soon
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Golf. Charity. Monthly Rewards. A subscription platform where every
          round you play makes a difference.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: Trophy, label: "Monthly Prize Draws" },
            { icon: Heart, label: "Charity Giving" },
            { icon: Target, label: "Score Tracking" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground"
            >
              <Icon className="w-4 h-4 text-primary" />
              {label}
            </div>
          ))}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
        >
          Get Early Access <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}