"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TreePine, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="text-center space-y-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center"
          >
            <TreePine className="w-8 h-8 text-destructive" strokeWidth={1.6} />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-6xl font-display font-bold text-destructive/60">500</p>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            An unexpected error occurred. This has been logged and we are looking into it. Please try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 10px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}