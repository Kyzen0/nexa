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
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const { data: notificationsData, error } = await supabase
    .from('notifications')
    .select('id, title, description, type, badge_text, is_read, created_at')
    .order('created_at', { ascending: false });

  const notifications = (notificationsData || []).map((notif) => {
    let icon = Info;
    let badgeVariant: "success" | "warning" | "brand" | "secondary" = "secondary";
    
    if (notif.type === "warning") {
      icon = PackageSearch;
      badgeVariant = "warning";
    } else if (notif.type === "success") {
      icon = CheckCircle2;
      badgeVariant = "success";
    } else if (notif.type === "info") {
      icon = Info;
      badgeVariant = notif.badge_text === "Sales" ? "brand" : "secondary";
    }

    const createdDate = new Date(notif.created_at);
    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - createdDate.getTime());
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeStr = "";
    if (diffMins < 60) timeStr = `${diffMins || 1} mins ago`;
    else if (diffHours < 24) timeStr = `${diffHours} hours ago`;
    else if (diffDays === 1) timeStr = "Yesterday";
    else timeStr = `${diffDays} days ago`;

    return {
      id: notif.id,
      title: notif.title,
      description: notif.description,
      type: notif.type,
      time: timeStr,
      read: notif.is_read,
      icon: icon,
      badgeVariant: badgeVariant,
      badgeText: notif.badge_text,
    };
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Activity & Alerts
            </h1>
            {unreadCount > 0 && (
              <Badge variant="warning" size="sm">
                {unreadCount} Unread
              </Badge>
            )}
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
