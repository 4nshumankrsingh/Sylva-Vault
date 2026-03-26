"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Check, Loader2, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { selectCharity } from "@/lib/actions/charity";

interface Charity {
  id:          string;
  name:        string;
  description: string;
  logoUrl:     string | null;
}

interface CharitySelection {
  charityId:           string;
  contributionPercent: number;
  charity:             Charity;
}

interface Props {
  charities: Charity[];
  current:   CharitySelection | null;
  canChange: boolean;
}

export function CharitySelector({ charities, current, canChange }: Props) {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState(current?.charityId ?? "");
  const [percent,    setPercent]    = useState(current?.contributionPercent ?? 10);
  const [expanded,   setExpanded]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [saved,      setSaved]      = useState(false);

  const changed =
    selectedId !== (current?.charityId ?? "") ||
    percent    !== (current?.contributionPercent ?? 10);

  async function handleSave() {
    if (!selectedId) return;
    setLoading(true);
    try {
      await selectCharity(selectedId, percent);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!canChange) {
    return (
      <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart className="w-4 h-4" />
          <span className="text-sm">Subscribe to choose your charity</span>
        </div>
        <a href="/subscribe" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          View plans →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current selection */}
      {current && (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{current.charity.name}</p>
            <p className="text-xs text-muted-foreground">{current.contributionPercent}% of your subscription</p>
          </div>
          <Check className="w-4 h-4 text-primary shrink-0" />
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-all duration-200"
      >
        <span>{current ? "Change charity" : "Select a charity"}</span>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground" />
        }
      </button>

      {expanded && (
        <div className="space-y-4 animate-fade-up">
          {/* Charity list */}
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {charities.map((charity) => {
              const isSelected = selectedId === charity.id;
              return (
                <button
                  key={charity.id}
                  onClick={() => setSelectedId(charity.id)}
                  className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200"
                  style={{
                    borderColor: isSelected ? "var(--primary)" : "var(--border)",
                    background:  isSelected
                      ? "color-mix(in srgb, var(--primary) 6%, var(--card-bg))"
                      : "var(--card-bg)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isSelected
                        ? "color-mix(in srgb, var(--primary) 15%, transparent)"
                        : "var(--muted)",
                    }}
                  >
                    <Heart
                      className="w-4 h-4"
                      style={{ color: isSelected ? "var(--primary)" : "var(--muted-fg)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{charity.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{charity.description}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Slider */}
          {selectedId && (
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Sliders className="w-4 h-4 text-primary" />
                  Contribution
                </div>
                <span className="text-sm font-bold text-primary">{percent}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10% (min)</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Save */}
          {changed && selectedId && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:brightness-110 disabled:opacity-60 transition-all"
              style={{ boxShadow: "0 2px 8px color-mix(in srgb, var(--primary) 30%, transparent)" }}
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                : saved
                ? <><Check className="w-4 h-4" />Saved!</>
                : "Save selection"
              }
            </button>
          )}
        </div>
      )}
    </div>
  );
}