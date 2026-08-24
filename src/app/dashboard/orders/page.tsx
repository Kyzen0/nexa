import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { OrderAddButton } from "@/components/dashboard/orders/order-add-button";
import { OrderDirectory } from "@/components/dashboard/orders/order-directory";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Fetch all customers for the dropdown
  const { data: customersData } = await supabase
    .from('customers')
    .select('id, name')
    .order('name', { ascending: true });
    
  const customers = customersData || [];

  // Fetch all orders
  const { data: ordersData, error } = await supabase
    .from('orders')
    .select(`
      id,
      channel,
      amount,
      status,
      created_at,
      customers ( id, name )
    `)
    .order('created_at', { ascending: false });

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const orders = (ordersData || []).map((order) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive" = "secondary";
    if (order.status === 'Fulfilled') badgeVariant = "success";
    else if (order.status === 'Processing') badgeVariant = "brand";
    else if (order.status === 'Pending') badgeVariant = "warning";
    else if (order.status === 'Cancelled') badgeVariant = "destructive";

    let customerName = "Unknown";
    let customerId = "";
    if (order.customers) {
      if (Array.isArray(order.customers)) {
        customerName = order.customers[0]?.name || "Unknown";
        customerId = order.customers[0]?.id || "";
      } else {
        customerName = (order.customers as any).name || "Unknown";
        customerId = (order.customers as any).id || "";
      }
    }

    const orderDate = new Date(order.created_at);
    const dateFormatted = orderDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      id: order.id,
      displayId: `ord_${order.id.substring(0, 7)}`,
      customer_id: customerId,
      customer: customerName,
      channel: order.channel,
      amount: order.amount,
      formattedAmount: currencyFormatter.format(Number(order.amount)),
      status: order.status,
      badgeVariant: badgeVariant,
      date: dateFormatted,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Order Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            View, add, and manage transactions across all sales channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <OrderAddButton customers={customers} />
        </div>
      </div>
      {/* Orders Directory Table */}
      <OrderDirectory orders={orders} customers={customers} />
    </div>
  );
}
