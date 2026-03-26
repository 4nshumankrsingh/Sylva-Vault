"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Trophy,
  Heart,
  Shield,
  Zap,
  Star,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const PLANS = [
  {
    id:          "MONTHLY" as const,
    name:        "Monthly",
    price:       "£9.99",
    period:      "/ month",
    description: "Perfect for getting started",
    badge:       null,
    features: [
      "Enter every monthly draw",
      "Track up to 5 Stableford scores",
      "Choose your charity",
      "Min. 10% to your chosen cause",
      "Full dashboard access",
    ],
  },
  {
    id:          "YEARLY" as const,
    name:        "Yearly",
    price:       "£99.99",
    period:      "/ year",
    description: "Best value — 2 months free",
    badge:       "Most Popular",
    features: [
      "Everything in Monthly",
      "Save £19.89 per year",
      "Priority draw entry",
      "Increased charity contribution",
      "Early access to new features",
    ],
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payments", sub: "Powered by Stripe"  },
  { icon: Zap,    label: "Instant Access",  sub: "Active immediately" },
  { icon: Heart,  label: "Charity First",   sub: "Min. 10% donated"   },
  { icon: Star,   label: "Cancel Anytime",  sub: "No lock-in"         },
];

export default function SubscribePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const supabase     = createClient();

  const [selected,   setSelected]   = useState<"MONTHLY" | "YEARLY">("YEARLY");
  const [loading,    setLoading]    = useState(false);
  const [authCheck,  setAuthCheck]  = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const cancelled = searchParams.get("cancelled") === "true";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      setAuthCheck(false);
    });
  }, []);

  async function handleSubscribe() {
    if (!isLoggedIn) {
      router.push("/signup?redirect=/subscribe");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("/api/stripe/create-checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan: selected }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (authCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-50" />

      <div className="max-w-5xl mx-auto px-4 py-20 space-y-16">

        {/* Cancelled banner */}
        {cancelled && (
          <div
            className="flex items-center gap-3 p-4 rounded-2xl border text-sm animate-fade-down"
            style={{
              background:  "color-mix(in srgb, #ef4444 8%, var(--card-bg))",
              borderColor: "color-mix(in srgb, #ef4444 25%, var(--border))",
              color:       "#ef4444",
            }}
          >
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Payment was cancelled. You can try again whenever you&apos;re ready.</span>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-up">
          <p className="text-sm font-medium text-primary tracking-widest uppercase">Membership</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
            Choose your plan
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Every subscription enters you into monthly draws and funds the charity you choose.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PLANS.map((plan, i) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className="relative text-left rounded-3xl border-2 p-7 transition-all duration-300 animate-fade-up focus:outline-none"
                style={{
                  animationDelay:  `${i * 100}ms`,
                  borderColor:     isSelected ? "var(--primary)" : "var(--border)",
                  background:      isSelected
                    ? "color-mix(in srgb, var(--primary) 5%, var(--card-bg))"
                    : "var(--card-bg)",
                  boxShadow:       isSelected
                    ? "0 4px 24px color-mix(in srgb, var(--primary) 18%, transparent)"
                    : "var(--shadow-card)",
                  transform:       isSelected ? "translateY(-2px)" : "none",
                }}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center justify-between mb-5">
                  <span className="font-display font-semibold text-xl text-foreground">{plan.name}</span>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      borderColor: isSelected ? "var(--primary)" : "var(--border)",
                      background:  isSelected ? "var(--primary)" : "transparent",
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-display font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 shrink-0"
                        style={{ color: isSelected ? "var(--primary)" : "var(--muted-fg)" }}
                      />
                      <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-primary text-white font-medium text-lg hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1"
            style={{ boxShadow: "0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent)" }}
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Redirecting to Stripe...</>
            ) : (
              <><Trophy className="w-5 h-5" />Subscribe — {selected === "YEARLY" ? "£99.99/yr" : "£9.99/mo"}</>
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            Secure checkout via Stripe · Cancel anytime from your dashboard
          </p>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
          {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center p-5 rounded-2xl border border-border bg-card gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}