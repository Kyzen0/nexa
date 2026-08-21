import React from "react";
import {
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GoalsPage() {
  const goals = [
    {
      id: "goal-1",
      title: "Increase Q3 Revenue by 15%",
      category: "Growth & Sales",
      target: "$1.5M",
      current: "$1.24M",
      progress: 82,
      status: "On Track",
      badgeVariant: "brand" as const,
      deadline: "End of Q3 2026",
    },
    {
      id: "goal-2",
      title: "Reduce Customer Churn under 2%",
      category: "Customer Retention",
      target: "2.0%",
      current: "2.4%",
      progress: 80,
      status: "At Risk",
      badgeVariant: "warning" as const,
      deadline: "End of Year",
    },
    {
      id: "goal-3",
      title: "Improve Gross Margin to 35%",
      category: "Cost & Efficiency",
      target: "35.0%",
      current: "32.8%",
      progress: 94,
      status: "On Track",
      badgeVariant: "brand" as const,
      deadline: "Sep 2026",
    },
    {
      id: "goal-4",
      title: "Launch 3 New Product Lines",
      category: "Product Expansion",
      target: "3 Lines",
      current: "3 Lines",
      progress: 100,
      status: "Achieved",
      badgeVariant: "success" as const,
      deadline: "Quarterly",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Business Goals
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track revenue targets, expansion milestones, and operational KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Create Goal</span>
          </Button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {goal.category}
                  </span>
                  <CardTitle className="text-sm font-semibold mt-1">
                    {goal.title}
                  </CardTitle>
                </div>
                <Badge variant={goal.badgeVariant} size="sm">
                  {goal.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Current: {goal.current}</span>
                  <span className="font-semibold text-foreground">Target: {goal.target}</span>
                </div>
                {/* Progress bar container */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-foreground transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono pt-1">
                <span>Milestone: {goal.deadline}</span>
                <span>{goal.progress}% Complete</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
