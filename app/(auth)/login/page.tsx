"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TreePine, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      {/* Logo */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            style={{ boxShadow: "0 4px 12px color-mix(in srgb, #0a7c4d 35%, transparent)" }}
          >
            <TreePine className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">Sylva Vault</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
      </div>

      {/* Card */}
      <div className="bg-card border border-border rounded-2xl p-7 shadow-xl"
        style={{ boxShadow: "0 4px 24px rgba(10,122,77,0.08), 0 1px 3px rgba(0,0,0,0.05)" }}
      >
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm"
                style={{ "--tw-ring-color": "color-mix(in srgb, #0a7c4d 25%, transparent)" } as React.CSSProperties}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            style={{ boxShadow: "0 4px 12px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>


      <p className="text-center text-xs text-muted-foreground">
        Secured with Supabase Auth · Data encrypted at rest
      </p>
    </div>
  );
}