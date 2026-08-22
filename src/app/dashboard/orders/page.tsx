import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { OrderAddButton } from "@/components/dashboard/orders/order-add-button";
import { OrderRowActions } from "@/components/dashboard/orders/order-row-actions";

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-sm font-semibold">
              All Orders
            </CardTitle>
            <CardDescription>
              Complete transaction history
            </CardDescription>
          </div>
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
                  <th className="py-2.5 px-4 font-medium">Date</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((order) => {
                  // Destructure out the visual properties we don't want to send to the Client Component
                  const { badgeVariant, formattedAmount, displayId, date, customer, ...orderDataToClient } = order;
                  
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="size-3.5 text-muted-foreground shrink-0" />
                          <div className="font-mono text-[11px] text-foreground">
                            {order.displayId}
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
                        {order.formattedAmount}
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
                      <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                        {order.date}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <OrderRowActions order={orderDataToClient} customers={customers} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {orders.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No orders found. Add one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
