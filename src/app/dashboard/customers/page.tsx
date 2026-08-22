import React from "react";
import {
  Building2,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { CustomerAddButton } from "@/components/dashboard/customers/customer-add-button";
import { CustomerRowActions } from "@/components/dashboard/customers/customer-row-actions";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: customersData, error } = await supabase
    .from('customers')
    .select('id, name, contact_email, tier, status, joined_at, orders(amount)');

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const customers = (customersData || []).map((cust) => {
    let badgeVariant: "success" | "warning" | "destructive" | "secondary" = "secondary";
    if (cust.status === "Active") badgeVariant = "success";
    else if (cust.status === "At Risk") badgeVariant = "warning";
    else if (cust.status === "Trial") badgeVariant = "secondary";

    const ordersArr = cust.orders || [];
    const ordersCount = Array.isArray(ordersArr) ? ordersArr.length : 0;
    
    let ltv = 0;
    if (Array.isArray(ordersArr)) {
      ltv = ordersArr.reduce((sum, order: any) => sum + Number(order.amount), 0);
    }

    const joinedDate = new Date(cust.joined_at);
    // Use UTC date to avoid timezone issues shifting the date
    const joinedStr = new Date(joinedDate.getTime() + Math.abs(joinedDate.getTimezoneOffset() * 60000))
      .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return {
      id: cust.id,
      name: cust.name,
      contact: cust.contact_email,
      tier: cust.tier,
      orders: ordersCount,
      ltv: currencyFormatter.format(ltv),
      status: cust.status,
      badgeVariant: badgeVariant,
      joined: joinedStr,
    };
  });

  const totalCustomers = customers.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Customers
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your customer relationships, track order history, and monitor lifetime value.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </Button>
          <CustomerAddButton />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Customers</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{totalCustomers}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+12% this quarter</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Repeat Purchase Rate</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">42.5%</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Implement when historical cohort tracking is available */}
            <span className="text-[11px] text-muted-foreground">Industry avg is 28%</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average Lifetime Value</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">$1,850</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Implement when we build historical average trend tracking */}
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+$140 vs last year</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Customer Churn Rate</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">2.4%</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Implement once we have historical cancellation/churn data models */}
            <span className="text-[11px] text-muted-foreground">Healthy retention metrics</span>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Directory Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold">
              Customer Directory
            </CardTitle>
            <CardDescription>
              Detailed view of your key wholesale and retail accounts
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <Input
                placeholder="Search customers or email..."
                className="pl-8 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y border-border bg-muted/20 text-muted-foreground">
                  <th className="py-2.5 px-4 font-medium">Customer</th>
                  <th className="py-2.5 px-4 font-medium hidden sm:table-cell">Type</th>
                  <th className="py-2.5 px-4 font-medium">Total Orders</th>
                  <th className="py-2.5 px-4 font-medium">Lifetime Value</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right hidden md:table-cell">Joined</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {customers.map((org) => (
                  <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        <span>{org.name}</span>
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground">
                        {org.contact}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                      {org.tier}
                    </td>
                    <td className="py-3 px-4 font-mono text-foreground">
                      {org.orders}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-foreground">
                      {org.ltv}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={org.badgeVariant} size="sm">
                        {org.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-muted-foreground text-[11px] hidden md:table-cell">
                      {org.joined}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <CustomerRowActions customer={org} />
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
