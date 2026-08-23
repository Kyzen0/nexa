"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type GettingStartedChecklistProps = {
  workspaceId: string;
  customersCount: number;
  productsCount: number;
  ordersCount: number;
  goalsCount: number;
};

export function GettingStartedChecklist({
  workspaceId,
  customersCount,
  productsCount,
  ordersCount,
  goalsCount,
}: GettingStartedChecklistProps) {
  const [dismissed, setDismissed] = useState(true); // Default true to prevent hydration mismatch flashes
  const [mounted, setMounted] = useState(false);

  const totalRecords = customersCount + productsCount + ordersCount + goalsCount;
  
  const checklist = [
    {
      id: "customer",
      label: "Add your first customer",
      href: "/dashboard/customers",
      completed: customersCount > 0,
    },
    {
      id: "product",
      label: "Add your first product",
      href: "/dashboard/products",
      completed: productsCount > 0,
    },
    {
      id: "order",
      label: "Record your first order",
      href: "/dashboard/orders",
      completed: ordersCount > 0,
    },
    {
      id: "goal",
      label: "Set a business goal",
      href: "/dashboard/goals",
      completed: goalsCount > 0,
    },
  ];

  const allCompleted = checklist.every((item) => item.completed);

  useEffect(() => {
    setMounted(true);
    const isDismissed = localStorage.getItem(`nexa_checklist_dismissed_${workspaceId}`);
    setDismissed(!!isDismissed);
  }, [workspaceId]);

  if (!mounted || dismissed || allCompleted || totalRecords > 10) {
    return null; // Hide if dismissed, fully completed, or workspace is clearly already active
  }

  const handleDismiss = () => {
    localStorage.setItem(`nexa_checklist_dismissed_${workspaceId}`, "true");
    setDismissed(true);
  };

  const completedCount = checklist.filter((item) => item.completed).length;

  return (
    <Card className="mb-6 relative border-brand/20 bg-brand/5 overflow-hidden">
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="size-4" />
      </button>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Getting started with Nexa</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Complete these basic steps to fully set up your workspace. ({completedCount}/{checklist.length})
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item) => (
            <Link 
              key={item.id} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-brand/40 transition-colors cursor-pointer",
                item.completed ? "border-success/30 bg-success/5" : "border-border"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="size-5 text-success shrink-0" />
              ) : (
                <Circle className="size-5 text-muted-foreground shrink-0" />
              )}
              <span className={cn("text-sm font-medium", item.completed ? "text-foreground" : "text-foreground")}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
