"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addReport, updateReport } from "@/app/actions/reports";
import { X, Loader2 } from "lucide-react";

type ReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report?: {
    id: string;
    title: string;
    period: string;
    format: string;
    status: string;
  };
};

const FORMATS = ["PDF", "CSV", "XLSX"];
const STATUSES = ["Draft", "Verified", "Finalized"];

export function ReportDialog({ open, onOpenChange, report }: ReportDialogProps) {
  const isEditing = !!report;

  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [status, setStatus] = useState(STATUSES[0]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (report) {
        setTitle(report.title);
        setPeriod(report.period);
        setFormat(FORMATS.includes(report.format) ? report.format : FORMATS[0]);
        setStatus(STATUSES.includes(report.status) ? report.status : STATUSES[0]);
      } else {
        setTitle("");
        setPeriod("");
        setFormat(FORMATS[0]);
        setStatus(STATUSES[0]);
      }
      setError(null);
    }
  }, [open, report]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("period", period);
      formData.append("format", format);
      formData.append("status", status);

      if (isEditing) {
        await updateReport(report.id, formData);
      } else {
        await addReport(formData);
      }
      
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight">{isEditing ? "Edit Report" : "Add Report"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditing ? "Update report metadata." : "Create a new report entry tracking record."}
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Report Title</label>
            <Input
              required
              placeholder="e.g. Q3 2026 Financial Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Period</label>
            <Input
              required
              placeholder="e.g. Q3 2026"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Format</label>
              <select
                required
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Report"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
