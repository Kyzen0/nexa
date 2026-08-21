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
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: recentOrdersData, error: ordersError } = await supabase
    .from('orders')
    .select(`
      id,
      channel,
      amount,
      status,
      created_at,
      customers ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  // Fetch all orders for KPIs (Total Revenue, Active Orders)
  const { data: allOrdersData } = await supabase
    .from('orders')
    .select('amount, status');
    
  const totalRevenue = allOrdersData 
    ? allOrdersData.reduce((sum, order) => sum + Number(order.amount), 0)
    : 0;

  const activeOrdersCount = allOrdersData
    ? allOrdersData.filter(o => o.status === 'Processing' || o.status === 'Pending').length
    : 0;

  // Fetch trending products
  const { data: topProductsData } = await supabase
    .from('products')
    .select('id, name, category, status, monthly_sales_volume')
    .order('monthly_sales_volume', { ascending: false })
    .limit(3);

  // Formatting helpers
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const kpis = [
    {
      title: "Total Revenue",
      value: currencyFormatter.format(totalRevenue),
      change: "+14.2%", // Static for now
      trend: "positive",
      description: "Across all integrated sales channels",
      icon: TrendingUp,
    },
    {
      title: "Net Margin",
      value: "24.8%", // TODO: Keep as static placeholder until cost tracking data model exists
      change: "+2.1%",
      trend: "positive",
      description: "Average margin after fulfillment",
      icon: Activity,
    },
    {
      title: "Active Orders",
      value: activeOrdersCount.toString(),
      change: "+8.7%", // Static for now
      trend: "positive",
      description: "Currently processing or in transit",
      icon: ShoppingCart,
    },
    {
      title: "Inventory Health",
      value: "98.2%", // TODO: Keep as static placeholder until inventory aging data model exists
      change: "Nominal",
      trend: "neutral",
      description: "Products well-stocked against projected demand",
      icon: ShieldCheck,
    },
  ];

  const recentOrders = (recentOrdersData || []).map((order) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive" = "secondary";
    if (order.status === 'Fulfilled') badgeVariant = "success";
    else if (order.status === 'Processing') badgeVariant = "brand";
    else if (order.status === 'Pending') badgeVariant = "warning";
    else if (order.status === 'Cancelled') badgeVariant = "destructive";

    // Handle customer name extraction
    let customerName = "Unknown";
    if (order.customers) {
      if (Array.isArray(order.customers)) {
        customerName = order.customers[0]?.name || "Unknown";
      } else {
        customerName = (order.customers as any).name || "Unknown";
      }
    }

    // Simplistic relative time formatting
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffMins = Math.round((now.getTime() - orderDate.getTime()) / 60000);
    const timestamp = diffMins === 0 ? 'Just now' : `${diffMins} mins ago`;

    return {
      id: `ord_${order.id.substring(0, 7)}`,
      customer: customerName,
      channel: order.channel,
      amount: currencyFormatter.format(Number(order.amount)),
      status: order.status,
      badgeVariant: badgeVariant,
      timestamp: timestamp,
    };
  });

  const topProducts = (topProductsData || []).map((product) => {
    let velocity = "Medium";
    if (product.monthly_sales_volume > 1000) velocity = "High";
    else if (product.monthly_sales_volume < 200) velocity = "Low";

    return {
      id: product.id,
      name: product.name,
      category: product.category,
      status: product.status,
      velocity: velocity,
    };
  });

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
                  key={product.id}
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
