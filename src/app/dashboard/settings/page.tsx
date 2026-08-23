import React from "react";
import {
  Copy,
  Key,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { DangerZone } from "@/components/dashboard/settings/danger-zone";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let workspaceName = "My Business";
  let workspaceSlug = "my-business";
  
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspaces(name)')
      .eq('id', user.id)
      .single();
    
    workspaceName = (profile?.workspaces as any)?.name || "My Business";
    workspaceSlug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  const apiKeys = [
    {
      id: "key-1",
      name: "Shopify Sync Token",
      prefix: "nx_shp_9f82...",
      created: "Aug 10, 2026",
      scope: "Full Access",
      lastUsed: "2 mins ago",
    },
    {
      id: "key-2",
      name: "QuickBooks Webhook",
      prefix: "nx_qbo_4a71...",
      created: "Jul 22, 2026",
      scope: "Write Only",
      lastUsed: "1 hour ago",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Workspace Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your organization parameters, connected integrations, and API access keys.
        </p>
      </div>

      {/* General Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Company Profile
          </CardTitle>
          <CardDescription>
            Core business details and billing parameters
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileForm 
            initialWorkspaceName={workspaceName} 
            initialEmail={user?.email || ""} 
          />
        </CardContent>
      </Card>

      {/* API Keys Management Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Key className="size-4 text-primary" />
              <span>Integrations & API Keys</span>
            </CardTitle>
            <CardDescription>
              Programmatic tokens to sync data with external commerce platforms
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Generate New Key</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium">Integration Name</th>
                  <th className="py-2.5 px-4 font-medium">Token Prefix</th>
                  <th className="py-2.5 px-4 font-medium">Scope</th>
                  <th className="py-2.5 px-4 font-medium">Last Synced</th>
                  <th className="py-2.5 px-4 font-medium text-right">Revoke</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {key.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <span>{key.prefix}</span>
                      <button className="text-muted-foreground hover:text-foreground">
                        <Copy className="size-3" />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" size="sm">
                        {key.scope}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                      {key.lastUsed}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}
