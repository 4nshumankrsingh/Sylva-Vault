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
import { Edit, Trash2, Eye } from "lucide-react";
import { EditCharityModal } from "./EditCharityModal";
import { deleteCharityAction } from "@/lib/actions/admin/charities";

interface Charity {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  imageUrl: string | null;
  website: string | null;
  featured: boolean;
  active: boolean;
  _count: { selections: number };
}

export function CharityList({ charities }: { charities: Charity[] }) {
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this charity?")) {
      await deleteCharityAction(id);
      window.location.reload();
    }
  };

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Supporters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-25">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {charities.map((charity) => (
              <TableRow key={charity.id}>
                <TableCell className="font-medium">{charity.name}</TableCell>
                <TableCell>{charity.slug}</TableCell>
                <TableCell>{charity._count.selections}</TableCell>
                <TableCell>
                  {charity.active ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {charity.featured ? (
                    <Badge>Featured</Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCharity(charity);
                        setShowEdit(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(charity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedCharity && (
        <EditCharityModal
          charity={selectedCharity}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </>
  );
}