import React from "react";
import {
  CheckCheck,
  CheckCircle2,
  Info,
  PackageSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function NotificationsPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Inventory Alert: Artisan Coffee Blend is running low",
      description: "Based on current sales velocity, you will run out of stock in approximately 4 days.",
      type: "warning",
      time: "10 mins ago",
      read: false,
      icon: PackageSearch,
      badgeVariant: "warning" as const,
      badgeText: "Reorder",
    },
    {
      id: "notif-2",
      title: "Goal Progress: Revenue Target at 85%",
      description: "You are on track to hit your Q3 revenue goal of $1.5M. Keep it up!",
      type: "success",
      time: "1 hour ago",
      read: false,
      icon: CheckCircle2,
      badgeVariant: "success" as const,
      badgeText: "Milestone",
    },
    {
      id: "notif-3",
      title: "New Customer: Meridian Co. placed their first order",
      description: "Meridian Co. just placed a wholesale order for $4,200.",
      type: "info",
      time: "3 hours ago",
      read: false,
      icon: Info,
      badgeVariant: "brand" as const,
      badgeText: "Sales",
    },
    {
      id: "notif-4",
      title: "Daily Report: Sales up 12% yesterday",
      description: "Your daily sales report is ready. Revenue increased by 12% compared to the previous Tuesday.",
      type: "info",
      time: "Yesterday",
      read: true,
      icon: Info,
      badgeVariant: "secondary" as const,
      badgeText: "Report",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Activity & Alerts
            </h1>
            <Badge variant="warning" size="sm">
              3 Unread
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time notifications for inventory alerts, sales milestones, and automated insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <CheckCheck className="size-3.5" />
            <span>Mark all as read</span>
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <Card
              key={notif.id}
              className={`transition-colors ${
                !notif.read
                  ? "border-neutral-300 dark:border-neutral-700 bg-card"
                  : "border-border/60 bg-muted/20 opacity-80"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg border border-border/80 bg-muted/50 p-2 text-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="size-1.5 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notif.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge variant={notif.badgeVariant} size="sm">
                      {notif.badgeText}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {notif.time}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
