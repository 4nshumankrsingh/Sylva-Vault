"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

export function ViewProofModal({
  proofUrl,
  open,
  onOpenChange,
}: {
  proofUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Winner Proof</DialogTitle>
        </DialogHeader>
        <div className="relative h-96 w-full">
          <Image
            src={proofUrl}
            alt="Proof"
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}