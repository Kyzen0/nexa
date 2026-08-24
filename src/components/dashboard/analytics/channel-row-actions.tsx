"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SimpleDropdown } from "@/components/ui/simple-dropdown";
import { ChannelDialog } from "@/components/dashboard/analytics/channel-dialog";
import { deleteChannel } from "@/app/actions/analytics";

type ChannelType = {
  id: string;
  name: string;
  monthly_orders: number;
  gross_revenue: number;
  net_margin_percentage: number;
  growth_mom_percentage: number;
};

export function ChannelRowActions({ channel }: { channel: ChannelType }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChannel(channel.id);
    } catch (error) {
      console.error("Failed to delete channel:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <SimpleDropdown
        align="right"
        trigger={
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </button>
        }
        items={[
          {
            label: "Edit channel",
            icon: <Edit className="size-3.5 text-muted-foreground" />,
            onClick: () => setShowEdit(true),
          },
          {
            label: "Delete channel",
            icon: <Trash2 className="size-3.5" />,
            variant: "destructive",
            onClick: () => setShowDeleteConfirm(true),
          },
        ]}
      />

      {/* Edit dialog */}
      <ChannelDialog open={showEdit} onOpenChange={setShowEdit} channel={channel} />

      {/* Delete confirmation - controlled state avoids nested triggers */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sales channel{" "}
              <strong className="text-foreground">{channel.name}</strong>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className={cn(buttonVariants({ variant: "destructive" }), "h-8 text-xs")}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 size-3 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
