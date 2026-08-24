"use client";

import React, { useState } from "react";
import { Search, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChannelAddButton } from "@/components/dashboard/analytics/channel-add-button";
import { ChannelRowActions } from "@/components/dashboard/analytics/channel-row-actions";

interface ChannelData {
  id: string;
  name: string;
  monthly_orders: number;
  gross_revenue: number;
  net_margin_percentage: number;
  growth_mom_percentage: number;
}

export function ChannelDirectory({ channels }: { channels: ChannelData[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredChannels = channels.filter((channel) => {
    if (!query) return true;
    return channel.name.toLowerCase().includes(query.toLowerCase());
  });

  const totalPages = Math.ceil(filteredChannels.length / pageSize);
  const paginatedChannels = filteredChannels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const compactCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' });
  const numberFormatter = new Intl.NumberFormat('en-US');

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-semibold">
            Sales Channel Performance
          </CardTitle>
          <CardDescription>
            Revenue breakdown and margin analysis by channel
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
            {channels.length} Active Channels
          </Badge>
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              className="pl-8 text-xs"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-y border-border bg-muted/20 text-muted-foreground">
                <th className="py-2.5 px-4 font-medium">Sales Channel</th>
                <th className="py-2.5 px-4 font-medium">Monthly Orders</th>
                <th className="py-2.5 px-4 font-medium">Gross Revenue</th>
                <th className="py-2.5 px-4 font-medium">Net Margin</th>
                <th className="py-2.5 px-4 font-medium text-right">Growth (MoM)</th>
                <th className="py-2.5 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {channels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Store className="size-8 text-muted-foreground/30" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No sales channels yet</p>
                        <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                          Add your first sales channel to start tracking revenue performance.
                        </p>
                      </div>
                      <div className="pt-2">
                        <ChannelAddButton />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredChannels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-muted-foreground">
                    No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
                  </td>
                </tr>
              ) : (
                paginatedChannels.map((channel) => (
                  <tr key={channel.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground flex items-center gap-2">
                      <Store className="size-3.5 text-muted-foreground" />
                      <span>{channel.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">{numberFormatter.format(channel.monthly_orders)}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{compactCurrency.format(Number(channel.gross_revenue))}</td>
                    <td className="py-3 px-4 font-mono text-foreground">{channel.net_margin_percentage}%</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      {channel.growth_mom_percentage > 0 ? '+' : ''}{channel.growth_mom_percentage}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <ChannelRowActions channel={channel} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <div className="text-[11px] text-muted-foreground font-medium">
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
      </CardContent>
    </Card>
  );
}
