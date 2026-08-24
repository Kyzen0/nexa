import React from "react";
import {
  Calendar,
  Download,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ChannelAddButton } from "@/components/dashboard/analytics/channel-add-button";
import { ChannelDirectory } from "@/components/dashboard/analytics/channel-directory";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: channelsData, error } = await supabase
    .from('sales_channels')
    .select('id, name, monthly_orders, gross_revenue, net_margin_percentage, growth_mom_percentage')
    .order('gross_revenue', { ascending: false });

  const channels = channelsData || [];

  const totalGMV = channels.reduce((sum, channel) => sum + Number(channel.gross_revenue), 0);
  const totalOrders = channels.reduce((sum, channel) => sum + Number(channel.monthly_orders), 0);
  const aov = totalOrders > 0 ? totalGMV / totalOrders : 0;

  const compactCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' });
  const exactCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });


  const numberFormatter = new Intl.NumberFormat('en-US');

  const formattedTotalGMV = compactCurrency.format(totalGMV);
  const formattedAOV = exactCurrency.format(aov);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Commerce Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sales performance, channel breakdown, and revenue growth metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Calendar className="size-3.5" />
            <span>Last 30 Days</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
          <ChannelAddButton />
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Gross Merchandise Value</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formattedTotalGMV}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Rolling 30 days</span>
            <Badge variant="success" size="sm">+12.4%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Customer Acquisition Cost</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">$24.50</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {/* TODO: Connect to marketing/ad-spend data model when built */}
            <span className="text-[11px] text-muted-foreground">Blended across channels</span>
            <Badge variant="secondary" size="sm">-4.2%</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average Order Value (AOV)</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{formattedAOV}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Includes B2B wholesale</span>
            <Badge variant="success" size="sm">+$1.80</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Refund / Return Rate</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">1.2%</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {/* TODO: Connect to fulfillment/returns data model when built */}
            <span className="text-[11px] text-muted-foreground">Industry avg is 3.5%</span>
            <Badge variant="success" size="sm">Healthy</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Regional Edge Telemetry Table -> Channel Performance Table */}
      <ChannelDirectory channels={channels} />
    </div>
  );
}
