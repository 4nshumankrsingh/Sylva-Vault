"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-border bg-muted animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-xl border border-border bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105 active:scale-95"
    >
      <Sun
        className={`w-4 h-4 absolute transition-all duration-300 ${
          isDark
            ? "opacity-0 rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`w-4 h-4 absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 -rotate-90 scale-50"
        }`}
      />
    </button>
  );
}