import { TreePine } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center animate-pulse-glow"
          style={{ boxShadow: "0 4px 20px color-mix(in srgb, #0a7c4d 35%, transparent)" }}
        >
          <TreePine className="w-6 h-6 text-white" strokeWidth={1.6} />
        </div>
        <div className="flex gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}