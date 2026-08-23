"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Loader2, Download } from "lucide-react";
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
import { ReportDialog } from "@/components/dashboard/reports/report-dialog";
import { deleteReport } from "@/app/actions/reports";

type ReportType = {
  id: string;
  title: string;
  period: string;
  format: string;
  status: string;
};

export function ReportRowActions({ report }: { report: ReportType }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteReport(report.id);
    } catch (error) {
      console.error("Failed to delete report:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="xs" className="gap-1 font-mono text-[11px] disabled:pointer-events-auto" disabled title="File generation coming soon">
        <Download className="size-3" />
        <span>Download</span>
      </Button>
      
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
            label: "Edit report",
            icon: <Edit className="size-3.5 text-muted-foreground" />,
            onClick: () => setShowEdit(true),
          },
          {
            label: "Delete report",
            icon: <Trash2 className="size-3.5" />,
            variant: "destructive",
            onClick: () => setShowDeleteConfirm(true),
          },
        ]}
      />

      {/* Edit dialog */}
      <ReportDialog open={showEdit} onOpenChange={setShowEdit} report={report} />

      {/* Delete confirmation - controlled state avoids nested triggers */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the report{" "}
              <strong className="text-foreground">{report.title}</strong>. This
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
