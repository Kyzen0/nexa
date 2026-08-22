import React from "react";
import {
  Bot,
  Play,
  RotateCw,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { AICommandInput } from "@/components/dashboard/ai-command-input";

export default async function AICommandCenterPage() {
  const supabase = await createClient();

  const { data: insightsData, error } = await supabase
    .from('ai_insights')
    .select('id, name, model, task_description, status, tokens_used, latency_ms')
    .order('created_at', { ascending: true });

  const compactFormatter = new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 });

  const insights = (insightsData || []).map((insight) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" = "secondary";
    if (insight.status === "Running") badgeVariant = "brand";
    else if (insight.status === "Completed") badgeVariant = "success";
    else if (insight.status === "Failed") badgeVariant = "warning";
    else if (insight.status === "Standby") badgeVariant = "secondary";

    return {
      id: insight.id,
      name: insight.name,
      model: insight.model,
      status: insight.status,
      badgeVariant: badgeVariant,
      task: insight.task_description,
      tokens: compactFormatter.format(insight.tokens_used),
      latency: `${insight.latency_ms}ms`,
      rawTokens: insight.tokens_used,
    };
  });

  const activeTasksCount = insights.filter(i => i.status === "Running").length;
  const totalTokensUsed = insights.reduce((sum, i) => sum + Number(i.rawTokens), 0);
  
  const formattedTokens = compactFormatter.format(totalTokensUsed);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              AI Business Assistant
            </h1>
            <Badge variant="brand" size="sm">
              Live Insights
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Query your business data, automate reports, and uncover hidden growth opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RotateCw className="size-3.5" />
            <span>Sync Data</span>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <Play className="size-3.5" />
            <span>New Query</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Active Background Tasks</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{activeTasksCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">Monitoring data in real-time</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Data Points Analyzed</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formattedTokens}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+150k this week</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Insight Accuracy</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">98.4%</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Connect to user feedback / rating data model */}
            <span className="text-[11px] text-muted-foreground">Based on user feedback</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Actionable Recommendations</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">12</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Connect to generated recommendations data model */}
            <span className="text-[11px] text-muted-foreground">Generated this month</span>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Command Execution Box */}
      <AICommandInput />

      {/* Active Agent Fleet Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Background Insights Engine
            </CardTitle>
            <CardDescription>
              Continuous AI tasks monitoring your business health
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter tasks..."
              className="h-7 w-40 text-xs hidden sm:block"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium">Task Name</th>
                  <th className="py-2.5 px-4 font-medium hidden md:table-cell">Description</th>
                  <th className="py-2.5 px-4 font-medium">Model</th>
                  <th className="py-2.5 px-4 font-medium">Tokens</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {insights.map((agent) => (
                  <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <Bot className="size-3.5 text-muted-foreground" />
                        <span>{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden md:table-cell max-w-xs truncate">
                      {agent.task}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                      {agent.model}
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {agent.tokens}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={agent.badgeVariant} size="sm">
                        {agent.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground text-[11px]">
                      {agent.latency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
