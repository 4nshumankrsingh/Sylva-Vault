import Link from "next/link";
import { TreePine, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-mesh-gradient opacity-50" />
      <div className="text-center space-y-8 max-w-md mx-auto">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg"
            style={{ boxShadow: "0 4px 24px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
          >
            <TreePine className="w-8 h-8 text-white" strokeWidth={1.6} />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-6xl font-display font-bold text-gradient">404</p>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you are looking for does not exist or has been moved. Head back to the homepage and try again.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "0 2px 10px color-mix(in srgb, #0a7c4d 30%, transparent)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            href="/draws"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-all hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            Browse Draws
          </Link>
        </div>
      </div>
    </div>
  );
}