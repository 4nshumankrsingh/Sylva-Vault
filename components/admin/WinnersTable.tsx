"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, PoundSterling, FileText } from "lucide-react";
import { verifyWinnerAction, markPaidAction } from "@/lib/actions/admin/winners";

import { ViewProofModal } from "./ViewProofModal";

interface Winner {
  id: string;
  matchCount: number;
  prizeAmount: number;
  paymentStatus: string;
  verificationStatus: string;
  proofUrl: string | null;
  user: { email: string; name: string | null };
  draw: { month: number; year: number; type: string };
}

export function WinnersTable({ winners }: { winners: Winner[] }) {
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const [showProof, setShowProof] = useState(false);

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    return status === "PAID" ? (
      <Badge className="bg-blue-500">Paid</Badge>
    ) : (
      <Badge variant="outline">Pending</Badge>
    );
  };

  const handleVerify = async (winnerId: string, status: "APPROVED" | "REJECTED") => {
    await verifyWinnerAction(winnerId, status);
    window.location.reload();
  };

  const handleMarkPaid = async (winnerId: string) => {
    await markPaidAction(winnerId);
    window.location.reload();
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Winner</TableHead>
              <TableHead>Draw</TableHead>
              <TableHead>Match</TableHead>
              <TableHead>Prize</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-35">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {winners.map((winner) => (
              <TableRow key={winner.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{winner.user.name || winner.user.email}</p>
                    <p className="text-xs text-muted-foreground">{winner.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {winner.draw.month}/{winner.draw.year} ({winner.draw.type})
                </TableCell>
                <TableCell>{winner.matchCount}</TableCell>
                <TableCell>£{winner.prizeAmount.toFixed(2)}</TableCell>
                <TableCell>{getVerificationBadge(winner.verificationStatus)}</TableCell>
                <TableCell>{getPaymentBadge(winner.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {winner.proofUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedWinner(winner);
                          setShowProof(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {winner.verificationStatus === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerify(winner.id, "APPROVED")}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVerify(winner.id, "REJECTED")}
                        >
                          <FileText className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    {winner.verificationStatus === "APPROVED" && winner.paymentStatus === "PENDING" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkPaid(winner.id)}
                      >
                        <PoundSterling className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {winners.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No winners yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedWinner && (
        <ViewProofModal
          proofUrl={selectedWinner.proofUrl!}
          open={showProof}
          onOpenChange={setShowProof}
        />
      )}
    </>
  );
}