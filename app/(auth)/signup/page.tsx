"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TreePine, Mail, Lock, User, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name,         setName]         = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [success,      setSuccess]      = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#0a7c4d"];

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center space-y-5 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-foreground">Check your inbox</h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            We sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click it to activate your account.
          </p>
        </div>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      <div className="space-y-1">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            style={{ boxShadow: "0 4px 12px color-mix(in srgb, #0a7c4d 35%, transparent)" }}
          >
            <TreePine className="w-5 h-5 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-xl font-display font-semibold text-foreground">Sylva Vault</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">Join and start playing with purpose</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-7 shadow-xl"
        style={{ boxShadow: "0 4px 24px rgba(10,122,77,0.08), 0 1px 3px rgba(0,0,0,0.05)" }}
      >
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <span className="mt-0.5 w-4 h-4 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 text-xs font-bold">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Full name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

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
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
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

            {password.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: passwordStrength >= level ? strengthColors[passwordStrength] : "var(--border)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strengthColors[passwordStrength] }}>
                  {strengthLabels[passwordStrength]} password
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-medium hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            style={{ boxShadow: "0 4px 12px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our{" "}
        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        {" "}and{" "}
        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
      </p>
    </div>
  );
}