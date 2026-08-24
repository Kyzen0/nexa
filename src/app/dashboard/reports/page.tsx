import React from "react";
import {
  FileText,
} from "lucide-react";
import { ReportAddButton } from "@/components/dashboard/reports/report-add-button";
import { ReportDirectory } from "@/components/dashboard/reports/report-directory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function ReportsPage() {
  const supabase = await createClient();

  const { data: reportsData, error } = await supabase
    .from('reports')
    .select('id, title, period, file_size_bytes, format, status, generated_at')
    .order('generated_at', { ascending: false });

  const formatBytes = (bytes: number, decimals = 1) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const reports = (reportsData || []).map((report) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" = "secondary";
    if (report.status === "Finalized" || report.status === "Verified") badgeVariant = "success";
    else if (report.status === "Draft") badgeVariant = "secondary";
    else if (report.status === "Generating") badgeVariant = "brand";
    else if (report.status === "Failed") badgeVariant = "warning";

    const generatedDate = new Date(report.generated_at);
    // Use UTC date to avoid timezone issues shifting the date
    const generatedStr = new Date(generatedDate.getTime() + Math.abs(generatedDate.getTimezoneOffset() * 60000))
      .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    return {
      id: report.id,
      title: report.title,
      period: report.period,
      generated: generatedStr,
      size: formatBytes(report.file_size_bytes),
      format: report.format,
      status: report.status,
      badgeVariant: badgeVariant,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Financial & Operational Reports
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generated summaries, accounting exports, and custom BI reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ReportAddButton />
        </div>
      </div>

      {/* Reports Table */}
      <ReportDirectory reports={reports} />
    </div>
  );
}
