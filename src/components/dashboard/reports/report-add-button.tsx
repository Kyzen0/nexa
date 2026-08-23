"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportDialog } from "@/components/dashboard/reports/report-dialog";

export function ReportAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setOpen(true)}>
        <Plus className="size-3.5" />
        <span>Generate Report</span>
      </Button>

      <ReportDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
