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
  LogIn,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, auth: true  },
  { href: "/draws",     label: "Draws",     icon: Trophy,          auth: false },
  { href: "/charities", label: "Charities", icon: Heart,           auth: false },
];

export function Navbar() {
  const pathname = usePathname();
  const supabase  = createClient();

  const [user,       setUser]       = useState<User | null>(null);
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "glass border-b border-border shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <TreePine className="w-4.5 h-4.5 text-white" strokeWidth={1.8} />
            </div>
            <span className="text-lg font-display font-semibold text-foreground hidden sm:block">
              Sylva Vault
            </span>
          </Link>


          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.filter((l) => !l.auth || user).map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.startsWith(href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </div>

  
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            ) : (
              <Link
                href="/signup"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-sm shadow-primary/25 hover:shadow-primary/40"
              >
                Get Started <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}

   
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-xl border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>


      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >

        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />


        <div
          className={`absolute top-0 right-0 h-full w-72 bg-card border-l border-border shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-foreground">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {NAV_LINKS.filter((l) => !l.auth || user).map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname.startsWith(href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-border">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}