"use client";

import { useState, useRef } from "react";
import { Trophy, Upload, CheckCircle2, Clock, XCircle, Loader2, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadProofAction } from "@/lib/actions/winners";

interface Winning {
  id: string;
  matchCount: number;
  prizeAmount: number;
  paymentStatus: string;
  verificationStatus: string;
  proofUrl: string | null;
  draw: { month: number; year: number };
}

interface WinningsSectionProps {
  winnings: Winning[];
}

function VerificationBadge({ status }: { status: string }) {
  if (status === "APPROVED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: "#0a7c4d", background: "rgba(10,122,77,0.1)" }}>
        <CheckCircle2 className="w-3 h-3" /> Approved
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}>
        <XCircle className="w-3 h-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: "#f59e0b", background: "rgba(245,158,11,0.1)" }}>
      <Clock className="w-3 h-3" /> Pending Verification
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  if (status === "PAID")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
        style={{ color: "#00b4d8", background: "rgba(0,180,216,0.1)" }}>
        <CheckCircle2 className="w-3 h-3" /> Paid
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: "#f59e0b", background: "rgba(245,158,11,0.1)" }}>
      <Clock className="w-3 h-3" /> Payment Pending
    </span>
  );
}

function ProofUploader({ winnerId }: { winnerId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("proof", file);

    try {
      await uploadProofAction(winnerId, formData);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-xs text-primary">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Proof uploaded successfully
      </div>
    );
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="h-7 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
      >
        {uploading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Upload className="w-3 h-3" />
        )}
        {uploading ? "Uploading..." : "Upload Proof"}
      </Button>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function WinningsSection({ winnings }: WinningsSectionProps) {
  if (winnings.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
          <Trophy className="w-5 h-5 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">No winnings yet — keep playing!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {winnings.map((w) => {
        const month = new Date(w.draw.year, w.draw.month - 1, 1).toLocaleString(
          "en-GB",
          { month: "short", year: "numeric" }
        );
        const needsProof =
          w.verificationStatus === "PENDING" && !w.proofUrl;

        return (
          <div
            key={w.id}
            className="p-4 rounded-xl border border-border bg-card space-y-3"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {w.matchCount}-Number Match
                </p>
                <p className="text-xs text-muted-foreground">{month}</p>
              </div>
              <p className="text-lg font-display font-bold text-primary">
                £{w.prizeAmount.toFixed(2)}
              </p>
            </div>

            {/* Status row */}
            <div className="flex items-center gap-2 flex-wrap">
              <VerificationBadge status={w.verificationStatus} />
              <PaymentBadge status={w.paymentStatus} />
            </div>

            {/* Proof section */}
            {w.proofUrl ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileImage className="w-3.5 h-3.5 text-primary" />
                Proof submitted
              </div>
            ) : needsProof ? (
              <div className="pt-1 border-t border-border space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot of your scores from your golf platform to claim this prize.
                </p>
                <ProofUploader winnerId={w.id} />
              </div>
            ) : null}

            {/* Rejection notice */}
            {w.verificationStatus === "REJECTED" && (
              <div
                className="flex items-start gap-2 p-3 rounded-lg text-xs"
                style={{
                  background: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <XCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Your submission was not approved. Please contact support if you believe this is an error.
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}