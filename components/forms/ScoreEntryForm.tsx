"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Calendar,
  Target,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Lock,
  Trophy,
} from "lucide-react";
import { addScore, deleteScore } from "@/lib/actions/scores";

interface Score {
  id: string;
  value: number;
  datePlayed: Date;
}

interface Props {
  scores: Score[];
  canAdd: boolean; // true only for ACTIVE subscribers
}

export function ScoreEntryForm({ scores, canAdd }: Props) {
  const router = useRouter();

  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 45) {
      setError("Score must be between 1 and 45");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await addScore(num, new Date(date));
      setValue("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add score");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteScore(id);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  function barWidth(v: number) {
    return `${((v - 1) / 44) * 100}%`;
  }

  return (
    <div className="space-y-6">
      {/* Score list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Your Scores</h3>
          <span className="text-xs text-muted-foreground">
            {scores.length}/5 entered
          </span>
        </div>

        {scores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-2xl text-center gap-2">
            <Target className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No scores yet</p>
            <p className="text-xs text-muted-foreground/60">
              Add your first Stableford score below
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {scores.map((score, i) => (
              <div
                key={score.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-display font-bold text-primary">
                    {score.value}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {score.value} pts
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(score.datePlayed).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-primary to-accent transition-all duration-500"
                      style={{ width: barWidth(score.value) }}
                    />
                  </div>
                </div>
                {/* Only show delete button if subscriber can manage scores */}
                {canAdd && (
                  <button
                    onClick={() => handleDelete(score.id)}
                    disabled={deleting === score.id}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 shrink-0"
                  >
                    {deleting === score.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add form — shown only to active subscribers */}
      {canAdd ? (
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                min={1}
                max={45}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Score (1–45)"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:border-primary text-sm transition-all"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                max={new Date().toISOString().split("T")[0]}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:border-primary text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all shrink-0"
              style={{
                boxShadow:
                  "0 2px 8px color-mix(in srgb, var(--primary) 30%, transparent)",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-destructive">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}
          {success && (
            <p className="flex items-center gap-1.5 text-xs text-primary animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Score added!
              {scores.length >= 5 && " Oldest score removed automatically."}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Only your 5 most recent scores are kept. Adding a 6th removes the
            oldest automatically.
          </p>
        </form>
      ) : (
        /* ── Locked state for non-subscribers ─────────────────────────────── */
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Subscribers Only
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Score entry and draw participation are available to active
              subscribers. Upgrade your plan to start tracking your Stableford
              scores and entering monthly prize draws.
            </p>
          </div>
          <a
            href="/subscribe"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 transition-all hover:-translate-y-0.5"
            style={{
              boxShadow:
                "0 2px 10px color-mix(in srgb, var(--primary) 30%, transparent)",
            }}
          >
            <Trophy className="w-4 h-4" />
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}