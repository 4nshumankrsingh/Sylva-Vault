"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { addScoreAdmin, deleteScoreAdmin } from "@/lib/actions/admin/users";

interface User {
  id: string;
  email: string;
  scores: {
    id: string;
    value: number;
    datePlayed: Date;
  }[];
}

export function ViewScoresModal({ user, open, onOpenChange }: { user: User; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const handleAddScore = async () => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 45) return;
    setLoading(true);
    try {
      await addScoreAdmin(num, new Date(date), user.id);
      // Refresh or update scores
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setValue("");
    }
  };

  const handleDeleteScore = async (scoreId: string) => {
    setLoading(true);
    try {
      await deleteScoreAdmin(scoreId, user.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Scores for {user.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {user.scores.map((score) => (
              <div key={score.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <span className="font-medium">{score.value}</span> pts
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(score.datePlayed).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteScore(score.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {user.scores.length === 0 && (
              <p className="text-muted-foreground text-sm">No scores</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={45}
              placeholder="Score"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-36"
            />
            <Button size="icon" onClick={handleAddScore} disabled={loading}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}