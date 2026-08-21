import React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Package,
  ShoppingCart,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$124,500.00",
      change: "+14.2%",
      trend: "positive",
      description: "Across all integrated sales channels",
      icon: TrendingUp,
    },
    {
      title: "Net Margin",
      value: "24.8%",
      change: "+2.1%",
      trend: "positive",
      description: "Average margin after fulfillment",
      icon: Activity,
    },
    {
      title: "Active Orders",
      value: "342",
      change: "+8.7%",
      trend: "positive",
      description: "Currently processing or in transit",
      icon: ShoppingCart,
    },
    {
      title: "Inventory Health",
      value: "98.2%",
      change: "Nominal",
      trend: "neutral",
      description: "Products well-stocked against projected demand",
      icon: ShieldCheck,
    },
  ];

  const recentOrders = [
    {
      id: "ord_8f93a1c",
      customer: "Alice V.",
      channel: "Shopify (Online)",
      amount: "$145.20",
      status: "Fulfilled",
      badgeVariant: "success" as const,
      timestamp: "2 mins ago",
    },
    {
      id: "ord_7c21e4b",
      customer: "Michael B.",
      channel: "POS (Retail)",
      amount: "$42.50",
      status: "Processing",
      badgeVariant: "brand" as const,
      timestamp: "Just now",
    },
    {
      id: "ord_4a02d9f",
      customer: "Sarah J.",
      channel: "Shopify (Online)",
      amount: "$820.00",
      status: "Fulfilled",
      badgeVariant: "success" as const,
      timestamp: "12 mins ago",
    },
    {
      id: "ord_1e84c7a",
      customer: "David K.",
      channel: "Amazon Marketplace",
      amount: "$32.10",
      status: "Pending",
      badgeVariant: "warning" as const,
      timestamp: "18 mins ago",
    },
    {
      id: "ord_9b52f3e",
      customer: "Emma W.",
      channel: "Shopify (Online)",
      amount: "$210.00",
      status: "Fulfilled",
      badgeVariant: "success" as const,
      timestamp: "45 mins ago",
    },
  ];

  const topProducts = [
    {
      name: "Artisan Coffee Blend",
      category: "Consumables",
      status: "Low Stock",
      velocity: "High",
    },
    {
      name: "Ceramic Pour-Over Dripper",
      category: "Equipment",
      status: "In Stock",
      velocity: "Medium",
    },
    {
      name: "Double-Walled Glass Mug",
      category: "Drinkware",
      status: "In Stock",
      velocity: "High",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Business Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time revenue, orders, and AI business insights across your sales channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground font-mono">
            <Clock className="size-3.5" />
            <span>UTC 18:45 • Live Sync</span>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <RefreshCw className="size-3.5" />
            <span>Sync</span>
          </Button>
          <Link href="/dashboard/ai-command">
            <Button size="sm" className="gap-1.5 text-xs">
              <Zap className="size-3.5" />
              <span>Ask AI Insights</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {kpi.title}
                </span>
                <div className="rounded-md border border-border/60 bg-muted/40 p-1 text-muted-foreground">
                  <Icon className="size-3.5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold tracking-tight font-mono text-foreground">
                    {kpi.value}
                  </span>
                  <Badge
                    variant={kpi.trend === "positive" ? "success" : "secondary"}
                    size="sm"
                    className="font-mono"
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Orders Table & Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Orders Stream */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Recent Orders
              </CardTitle>
              <CardDescription>
                Live transaction feed from all connected channels
              </CardDescription>
            </div>
            <Link
              href="/dashboard/analytics"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
            >
              <span>View all orders</span>
              <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y border-border/80 bg-muted/20 text-muted-foreground">
                    <th className="py-2.5 px-4 font-medium">Order ID</th>
                    <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Customer</th>
                    <th className="py-2.5 px-4 font-medium">Channel</th>
                    <th className="py-2.5 px-4 font-medium">Amount</th>
                    <th className="py-2.5 px-4 font-medium">Status</th>
                    <th className="py-2.5 px-4 font-medium text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="size-3.5 text-muted-foreground shrink-0" />
                          <div className="font-mono text-[11px] text-foreground">
                            {order.id}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground hidden sm:table-cell">
                        {order.customer}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {order.channel}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-foreground">
                        {order.amount}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={order.badgeVariant}
                          size="sm"
                          className="font-medium"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground font-mono text-[11px]">
                        {order.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Products & Alerts */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Package className="size-4 text-primary" />
                  <span>Trending Products</span>
                </CardTitle>
                <Badge variant="brand" size="sm">
                  Top 3
                </Badge>
              </div>
              <CardDescription>
                Highest velocity items this week
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((product) => (
                <div
                  key={product.name}
                  className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs space-y-1.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {product.name}
                    </span>
                    <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                      {product.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                    <span>{product.category}</span>
                    <span>Velocity: {product.velocity}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/20 border-dashed">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-foreground">
                  AI Action Required
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Artisan Coffee Blend predicting stockout
                </div>
              </div>
              <Link href="/dashboard/products">
                <Button variant="outline" size="sm" className="text-xs">
                  Reorder
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
