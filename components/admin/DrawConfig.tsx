"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Play } from "lucide-react";
import { simulateDrawAction, publishDrawAction } from "@/lib/actions/admin/draws";

export function DrawConfig() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [drawType, setDrawType] = useState<"RANDOM" | "ALGORITHMIC">("RANDOM");
  const [simulation, setSimulation] = useState<any>(null);
  const [loadingSim, setLoadingSim] = useState(false);
  const [loadingPub, setLoadingPub] = useState(false);

  const handleSimulate = async () => {
    setLoadingSim(true);
    try {
      const result = await simulateDrawAction(month, year, drawType);
      setSimulation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSim(false);
    }
  };

  const handlePublish = async () => {
    setLoadingPub(true);
    try {
      await publishDrawAction(month, year, drawType);
      alert("Draw published successfully!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to publish draw");
    } finally {
      setLoadingPub(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Draw Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Month</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              min={2024}
              max={2030}
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Draw Type</Label>
            <select
              value={drawType}
              onChange={(e) => setDrawType(e.target.value as any)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="RANDOM">Random</option>
              <option value="ALGORITHMIC">Algorithmic (weighted)</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSimulate} disabled={loadingSim}>
            {loadingSim ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Simulate Draw
          </Button>
          <Button onClick={handlePublish} disabled={loadingPub} variant="default">
            {loadingPub ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Publish Draw
          </Button>
        </div>

        {simulation && (
          <div className="mt-6 p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Simulation Results</h3>
            <p>Drawn numbers: {simulation.drawnNumbers.join(", ")}</p>
            <p>Total entries: {simulation.entries?.length ?? 0}</p>
            <p>Winners: {simulation.winners?.length ?? 0}</p>
            <p>Prize pool: ${simulation.prizePool?.total.toFixed(2)}</p>
            <p>Jackpot rollover: {simulation.jackpotRolled ? "Yes" : "No"}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}