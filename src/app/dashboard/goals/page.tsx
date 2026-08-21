import React from "react";
import {
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function GoalsPage() {
  const supabase = await createClient();

  const { data: goalsData, error } = await supabase
    .from('goals')
    .select('id, title, category, target_value, current_value, progress_percentage, status, deadline')
    .order('created_at', { ascending: true });

  const goals = (goalsData || []).map((goal) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive" = "secondary";
    if (goal.status === "On Track") badgeVariant = "brand";
    else if (goal.status === "At Risk") badgeVariant = "warning";
    else if (goal.status === "Achieved") badgeVariant = "success";
    else if (goal.status === "Exceeding Target") badgeVariant = "success";

    return {
      id: goal.id,
      title: goal.title,
      category: goal.category,
      target: goal.target_value,
      current: goal.current_value,
      progress: goal.progress_percentage,
      status: goal.status,
      badgeVariant: badgeVariant,
      deadline: goal.deadline,
    };
  });

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
