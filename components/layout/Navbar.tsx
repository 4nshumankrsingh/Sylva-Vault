"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  TreePine,
  LayoutDashboard,
  Trophy,
  Heart,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/draws",     label: "Draws",     icon: Trophy,          auth: false },
  { href: "/charities", label: "Charities", icon: Heart,           auth: false },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, auth: true  },
];

export function Navbar() {
  const pathname  = usePathname();
  const supabase  = createClient();

  const [user,       setUser]       = useState<SupabaseUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const visibleLinks = NAV_LINKS.filter((l) => !l.auth || user);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-border shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{ boxShadow: "0 2px 8px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
            >
              <TreePine className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
            </div>
            <span className="text-lg font-display font-semibold text-foreground hidden sm:block tracking-tight">
              Sylva Vault
            </span>
          </Link>


          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted border border-border text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-30 truncate">
                    {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                  style={{ boxShadow: "0 2px 10px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
                >
                  Get Started <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}


            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
            >
              <span
                className={`absolute transition-all duration-300 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
              >
                <X className="w-4 h-4" />
              </span>
              <span
                className={`absolute transition-all duration-300 ${mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
              >
                <Menu className="w-4 h-4" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 md:hidden transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: "var(--card-bg)", borderLeft: "1px solid var(--border)" }}
      >

        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <TreePine className="w-3.5 h-3.5 text-white" strokeWidth={1.8} />
            </div>
            <span className="font-display font-semibold text-foreground text-sm">Sylva Vault</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>


        <nav className="p-4 space-y-1">
          {visibleLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>


        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted text-sm">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-muted-foreground truncate">
                  {user.user_metadata?.full_name ?? user.email?.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all duration-200"
                style={{ boxShadow: "0 2px 10px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
              >
                Get Started <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}