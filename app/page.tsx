import Link from "next/link";
import {
  TreePine,
  ArrowRight,
  Trophy,
  Heart,
  Target,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  Shield,
} from "lucide-react";

const STATS = [
  { value: "£12,400", label: "Total Prizes Paid", icon: Trophy },
  { value: "340+", label: "Active Members", icon: Users },
  { value: "18", label: "Charities Supported", icon: Heart },
  { value: "96%", label: "Member Satisfaction", icon: Star },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Subscribe",
    description:
      "Choose a monthly or yearly plan. A portion of every subscription goes directly to your chosen charity.",
    icon: Shield,
  },
  {
    step: "02",
    title: "Enter Your Scores",
    description:
      "Log your last 5 Stableford scores after each round. The system keeps them rolling — newest in, oldest out.",
    icon: Target,
  },
  {
    step: "03",
    title: "Enter the Draw",
    description:
      "Your scores become your draw numbers every month. Match 3, 4, or all 5 to win your share of the prize pool.",
    icon: Trophy,
  },
  {
    step: "04",
    title: "Give Back",
    description:
      "Every subscription contributes to the charity you selected. Play golf. Win prizes. Change lives.",
    icon: Heart,
  },
];

const FEATURED_CHARITIES = [
  { name: "Golf Foundation", cause: "Youth development through golf", color: "#0a7c4d" },
  { name: "Macmillan Cancer", cause: "Support for cancer patients", color: "#00b4d8" },
  { name: "Help for Heroes", cause: "Supporting wounded veterans", color: "#065d38" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="absolute inset-0 -z-10 bg-mesh-gradient" />

        {/* Decorative orbs */}
        <div
          className="absolute top-1/4 left-[8%] w-72 h-72 rounded-full -z-10 opacity-30"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, #0a7c4d 40%, transparent), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-[8%] w-64 h-64 rounded-full -z-10 opacity-25"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, #00b4d8 40%, transparent), transparent 70%)",
            filter: "blur(48px)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Eyebrow tag */}
          <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-border bg-card text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              Golf · Charity · Monthly Draws
            </span>
          </div>

          {/* Headline */}
          <div className="animate-fade-up space-y-3" style={{ animationDelay: "80ms" }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.08] tracking-tight">
              Every round you
              <br />
              play{" "}
              <em className="not-italic text-gradient">matters.</em>
            </h1>
          </div>

          {/* Sub */}
          <p
            className="animate-fade-up max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            A subscription platform where your Stableford scores enter you into
            monthly prize draws — while supporting the charity you care about most.
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-up flex flex-col sm:flex-row gap-3 justify-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary text-white font-medium text-base hover:bg-primary-light transition-all duration-300 hover:-translate-y-1"
              style={{ boxShadow: "0 4px 14px color-mix(in srgb, #0a7c4d 35%, transparent)" }}
            >
              Start Playing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/charities"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-border bg-card text-foreground font-medium text-base hover:bg-muted hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Heart className="w-4 h-4 text-primary" />
              Browse Charities
            </Link>
          </div>

          {/* Trust line */}
          <p
            className="animate-fade-up text-sm text-muted-foreground"
            style={{ animationDelay: "320ms" }}
          >
            No hidden fees · Cancel anytime · 10% minimum to charity
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in flex flex-col items-center gap-2 text-muted-foreground" style={{ animationDelay: "800ms" }}>
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-linear-to-b from-border to-transparent" />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="relative py-12 border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border stagger">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center px-6 py-2 animate-fade-up"
              >
                <Icon className="w-5 h-5 text-primary mb-2 opacity-70" />
                <span className="text-3xl font-display font-bold text-foreground">{value}</span>
                <span className="text-sm text-muted-foreground mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-medium text-primary tracking-widest uppercase">How it works</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Simple by design.
              <br />
              <span className="text-gradient">Powerful by nature.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {HOW_IT_WORKS.map(({ step, title, description, icon: Icon }) => (
              <div
                key={step}
                className="card-elevated p-6 space-y-4 animate-fade-up group cursor-default"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-4xl font-display font-bold text-border group-hover:text-primary/20 transition-colors duration-300 select-none">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 px-4 bg-card border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-mesh-gradient opacity-60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary tracking-widest uppercase">Prize Pool</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Three ways to win,
              <br />
              <span className="text-gradient">every month.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { match: "5 Numbers", share: "40%", label: "Jackpot", rollover: true, accent: "primary" },
              { match: "4 Numbers", share: "35%", label: "Major Prize", rollover: false, accent: "accent" },
              { match: "3 Numbers", share: "25%", label: "Prize", rollover: false, accent: "primary" },
            ].map(({ match, share, label, rollover, accent }) => (
              <div
                key={match}
                className="card-elevated p-6 text-center space-y-3 group"
              >
                <div
                  className="text-4xl font-display font-bold"
                  style={{ color: accent === "accent" ? "var(--accent)" : "var(--primary)" }}
                >
                  {share}
                </div>
                <div className="text-foreground font-semibold">{label}</div>
                <div className="text-sm text-muted-foreground">Match {match}</div>
                {rollover && (
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <TrendingUp className="w-3 h-3" />
                    Jackpot rolls over
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Prize pool grows automatically with every new subscriber. Split equally among multiple winners in the same tier.
          </p>
        </div>
      </section>


      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <p className="text-sm font-medium text-primary tracking-widest uppercase">Charity</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                Play golf.
                <br />
                <span className="text-gradient">Fund what matters.</span>
              </h2>
            </div>
            <Link
              href="/charities"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors group shrink-0"
            >
              View all charities
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger">
            {FEATURED_CHARITIES.map(({ name, cause, color }) => (
              <div
                key={name}
                className="card-elevated p-6 space-y-4 animate-fade-up group cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  <Heart className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-lg">{name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cause}</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Min. contribution</span>
                    <span className="font-medium text-primary">10% of subscription</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative rounded-3xl p-10 md:p-14 text-center space-y-6 overflow-hidden border border-primary/20"
            style={{
              background: "linear-gradient(135deg, color-mix(in srgb, #0a7c4d 12%, var(--card-bg)), color-mix(in srgb, #00b4d8 8%, var(--card-bg)))",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full z-0 opacity-20"
              style={{
                background: "radial-gradient(circle, #0a7c4d, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg animate-pulse-glow">
                <TreePine className="w-7 h-7 text-white" strokeWidth={1.6} />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Ready to tee off?
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Join hundreds of golfers who play with purpose. Subscribe today and your first draw entry is this month.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-white font-medium hover:bg-primary-light transition-all duration-300 hover:-translate-y-1 group"
                style={{ boxShadow: "0 4px 14px color-mix(in srgb, #0a7c4d 35%, transparent)" }}
              >
                Get Started — It&apos;s Free to Join
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}