"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SimpleDropdown } from "@/components/ui/simple-dropdown";
import { GoalDialog } from "@/components/dashboard/goals/goal-dialog";
import { deleteGoal } from "@/app/actions/goals";

type GoalType = {
  id: string;
  title: string;
  category: string;
  target: string;
  current: string;
  progress: number;
  status: string;
  deadline: string;
};

export function GoalCardActions({ goal }: { goal: GoalType }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGoal(goal.id);
    } catch (error) {
      console.error("Failed to delete goal:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
            label: "Edit goal",
            icon: <Edit className="size-3.5 text-muted-foreground" />,
            onClick: () => setShowEdit(true),
          },
          {
            label: "Delete goal",
            icon: <Trash2 className="size-3.5" />,
            variant: "destructive",
            onClick: () => setShowDeleteConfirm(true),
          },
        ]}
      />

      {/* Edit dialog */}
      <GoalDialog open={showEdit} onOpenChange={setShowEdit} goal={goal} />

      {/* Delete confirmation — AlertDialog (already exists, no missing dep) */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the goal{" "}
              <strong className="text-foreground">{goal.title}</strong>. This
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
    </>
  );
}
