"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerExportData {
  name: string;
  contact: string;
  tier: string;
  orders: number;
  rawLtv: number;
  status: string;
  joined: string;
}

export function CustomerExportButton({ customers }: { customers: CustomerExportData[] }) {
  const handleExport = () => {
    if (customers.length === 0) return;

    // Build CSV headers matching visible columns
    const headers = [
      "Name",
      "Contact Email",
      "Tier",
      "Status",
      "Joined At",
      "Total Orders",
      "Lifetime Value"
    ];

    // Escape CSV values safely
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = customers.map(c => [
      escapeCsv(c.name),
      escapeCsv(c.contact),
      escapeCsv(c.tier),
      escapeCsv(c.status),
      escapeCsv(c.joined),
      escapeCsv(c.orders),
      escapeCsv(c.rawLtv)
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const dateStr = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `nexa-customers-export-${dateStr}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={handleExport}
      disabled={customers.length === 0}
    >
      <Download className="size-3.5" />
      <span>{customers.length === 0 ? "No data to export" : "Export CSV"}</span>
    </Button>
  );
}
