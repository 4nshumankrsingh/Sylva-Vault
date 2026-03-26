"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { updateUserRole, updateSubscriptionStatus } from "@/lib/actions/admin/users";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "PUBLIC" | "SUBSCRIBER" | "ADMIN";
  subscription: {
    status: string;
    plan: string;
    id: string;
  } | null;
}

interface EditUserModalProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserModal({ user, open, onOpenChange }: EditUserModalProps) {
  const [role, setRole] = useState<"PUBLIC" | "SUBSCRIBER" | "ADMIN">(user.role);
  const [subStatus, setSubStatus] = useState(user.subscription?.status || "INACTIVE");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserRole(user.id, role);
      if (user.subscription) {
        await updateSubscriptionStatus(user.subscription.id, subStatus);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={user.name || ""} disabled />
          </div>
          <div>
            <Label>Role</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "PUBLIC" | "SUBSCRIBER" | "ADMIN")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="PUBLIC">Public</option>
              <option value="SUBSCRIBER">Subscriber</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {user.subscription && (
            <div>
              <Label>Subscription Status</Label>
              <select
                value={subStatus}
                onChange={(e) => setSubStatus(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="LAPSED">Lapsed</option>
              </select>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}