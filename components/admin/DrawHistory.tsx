"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Draw {
  id: string;
  month: number;
  year: number;
  type: "RANDOM" | "ALGORITHMIC";
  status: string;
  publishedAt: Date | null;
  prizePool: { totalAmount: number } | null;
  winners: any[];
}

export function DrawHistory({ draws }: { draws: Draw[] }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-500">Published</Badge>;
      case "SIMULATED":
        return <Badge className="bg-blue-500">Simulated</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month/Year</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prize Pool</TableHead>
            <TableHead>Winners</TableHead>
            <TableHead>Published</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {draws.map((draw) => (
            <TableRow key={draw.id}>
              <TableCell>
                {draw.month}/{draw.year}
              </TableCell>
              <TableCell>{draw.type}</TableCell>
              <TableCell>{getStatusBadge(draw.status)}</TableCell>
              <TableCell>${draw.prizePool?.totalAmount.toFixed(2) ?? "0"}</TableCell>
              <TableCell>{draw.winners.length}</TableCell>
              <TableCell>
                {draw.publishedAt ? new Date(draw.publishedAt).toLocaleDateString() : "—"}
              </TableCell>
            </TableRow>
          ))}
          {draws.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No draws yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}