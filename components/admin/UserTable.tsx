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
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserModal } from "./EditUserModal";
import { ViewScoresModal } from "./ViewScoresModal";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "PUBLIC" | "SUBSCRIBER" | "ADMIN";
  subscription: {
    status: string;
    plan: string;
  } | null;
  scores: {
    id: string;
    value: number;
    datePlayed: Date;
  }[];
}

export function UserTable({ users }: { users: User[] }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showScores, setShowScores] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "SUBSCRIBER":
        return <Badge className="bg-green-500">Subscriber</Badge>;
      default:
        return <Badge variant="outline">Public</Badge>;
    }
  };

  const getSubscriptionStatus = (sub: any) => {
    if (!sub) return <span className="text-muted-foreground">None</span>;
    const statusColor =
      sub.status === "ACTIVE"
        ? "text-green-500"
        : sub.status === "CANCELLED"
        ? "text-orange-500"
        : "text-red-500";
    return (
      <span className={statusColor}>
        {sub.status} ({sub.plan})
      </span>
    );
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Scores</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getSubscriptionStatus(user.subscription)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowScores(true);
                    }}
                  >
                    View ({user.scores.length})
                  </Button>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEdit(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowScores(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Scores
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <EditUserModal
            user={selectedUser}
            open={showEdit}
            onOpenChange={setShowEdit}
          />
          <ViewScoresModal
            user={selectedUser}
            open={showScores}
            onOpenChange={setShowScores}
          />
        </>
      )}
    </>
  );
}