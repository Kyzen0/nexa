"use client";

import React, { useState } from "react";
import { Search, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoalAddButton } from "@/components/dashboard/goals/goal-add-button";
import { GoalCardActions } from "@/components/dashboard/goals/goal-card-actions";
import { Button } from "@/components/ui/button";

interface GoalData {
  id: string;
  title: string;
  category: string;
  target: string;
  current: string;
  progress: number;
  status: string;
  badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive";
  deadline: string;
}

export function GoalDirectory({ goals }: { goals: GoalData[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredGoals = goals.filter((goal) => {
    if (!query) return true;
    const q = query.toLowerCase();
    // Goals filter by title + category
    return goal.title.toLowerCase().includes(q) || goal.category.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredGoals.length / pageSize);
  const paginatedGoals = filteredGoals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (goals.length === 0) {
    return (
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search goals or category..."
            className="pl-8 text-xs"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border py-20 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedGoals.map((goal) => (
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <div className="text-[11px] text-muted-foreground font-medium pl-1">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
