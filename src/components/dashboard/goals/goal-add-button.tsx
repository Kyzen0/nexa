"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDialog } from "@/components/dashboard/goals/goal-dialog";

export function GoalAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" />
        <span>Create Goal</span>
      </Button>

      <GoalDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
