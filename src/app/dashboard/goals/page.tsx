import React from "react";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoalAddButton } from "@/components/dashboard/goals/goal-add-button";
import { GoalCardActions } from "@/components/dashboard/goals/goal-card-actions";
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
          <GoalAddButton />
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border py-20 bg-muted/10">
          <Target className="size-8 text-muted-foreground/30" />
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium text-foreground">No goals yet</p>
            <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
              Set your first business goal to track your company's progress and milestones.
            </p>
          </div>
          <div className="pt-2">
            <GoalAddButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {goal.category}
                    </span>
                    <CardTitle className="text-sm font-semibold mt-1 pr-6">
                      {goal.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={goal.badgeVariant} size="sm">
                      {goal.status}
                    </Badge>
                    <GoalCardActions goal={{
                      id: goal.id,
                      title: goal.title,
                      category: goal.category,
                      target: goal.target,
                      current: goal.current,
                      progress: goal.progress,
                      status: goal.status,
                      deadline: goal.deadline,
                    }} />
                  </div>
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
      )}
    </div>
  );
}
