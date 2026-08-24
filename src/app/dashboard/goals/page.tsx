import React from "react";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GoalAddButton } from "@/components/dashboard/goals/goal-add-button";
import { GoalDirectory } from "@/components/dashboard/goals/goal-directory";
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
      <GoalDirectory goals={goals} />
    </div>
  );
}
