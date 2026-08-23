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
import { MarkAllReadButton } from "@/components/dashboard/notifications/mark-all-read-button";
import { Bell } from "lucide-react";

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
          {unreadCount > 0 && <MarkAllReadButton />}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border py-24 bg-muted/10">
          <Bell className="size-8 text-muted-foreground/30" />
          <div className="space-y-1 text-center">
            <p className="text-sm font-medium text-foreground">You have no new notifications</p>
            <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
              We'll notify you here when there are important updates about your inventory or sales.
            </p>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
