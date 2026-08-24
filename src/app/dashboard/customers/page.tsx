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
import { CustomerExportButton } from "@/components/dashboard/customers/customer-export-button";
import { CustomerDirectory } from "@/components/dashboard/customers/customer-directory";

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
      rawLtv: ltv,
      ltv: currencyFormatter.format(ltv),
      status: cust.status,
      badgeVariant: badgeVariant,
      joined: joinedStr,
    };
  });

  const totalCustomers = customers.length;
  const customersWithOrders = customers.filter(c => c.orders > 0);
  const customersWithRepeatOrders = customers.filter(c => c.orders > 1);
  
  // Calculate Repeat Purchase Rate
  const repeatPurchaseRate = customersWithOrders.length > 0
    ? ((customersWithRepeatOrders.length / customersWithOrders.length) * 100).toFixed(1) + "%"
    : "—";

  // Calculate Average Lifetime Value
  const avgLtvValue = customersWithOrders.length > 0
    ? customersWithOrders.reduce((sum, c) => sum + c.rawLtv, 0) / customersWithOrders.length
    : 0;
  const avgLtv = customersWithOrders.length > 0 ? currencyFormatter.format(avgLtvValue) : "—";

  // Calculate Churn Rate
  const atRiskCustomers = customers.filter(c => c.status === "At Risk").length;
  const churnRate = totalCustomers > 0
    ? ((atRiskCustomers / totalCustomers) * 100).toFixed(1) + "%"
    : "—";

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
          <CustomerExportButton customers={customers} />
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
            <span className="text-[11px] text-muted-foreground">All registered accounts</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Repeat Purchase Rate</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{repeatPurchaseRate}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">
              {customersWithOrders.length === 0 ? "No orders yet" : "Customers with >1 order"}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Average Lifetime Value</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{avgLtv}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">
              {customersWithOrders.length === 0 ? "No orders yet" : "Avg total spend per active customer"}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Customer Churn Rate</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">{churnRate}</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-[11px] text-muted-foreground">
              {totalCustomers === 0 ? "No customers yet" : "Based on 'At Risk' status"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Directory Table */}
      <CustomerDirectory customers={customers} />
    </div>
  );
}
