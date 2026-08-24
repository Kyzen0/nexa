"use client";

import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderAddButton } from "@/components/dashboard/orders/order-add-button";
import { OrderRowActions } from "@/components/dashboard/orders/order-row-actions";

interface OrderData {
  id: string;
  displayId: string;
  customer_id: string;
  customer: string;
  channel: string;
  amount: string;
  formattedAmount: string;
  status: string;
  badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive";
  date: string;
}

export function OrderDirectory({ orders, customers }: { orders: OrderData[], customers: any[] }) {
  const [query, setQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (!query) return true;
    const q = query.toLowerCase();
    // Orders filter by customer name + order ID
    return order.customer.toLowerCase().includes(q) || order.id.toLowerCase().includes(q);
  });

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-semibold">
            Recent Orders
          </CardTitle>
          <CardDescription>
            Complete transaction history
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Search by customer or order ID..."
              className="pl-8 text-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
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
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <ShoppingCart className="size-8 text-muted-foreground/30" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No orders yet</p>
                        <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                          Record your first order to start generating revenue and tracking fulfillment.
                        </p>
                      </div>
                      <div className="pt-2">
                        <OrderAddButton customers={customers} />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderDataToClient = {
                    id: order.id,
                    customer_id: order.customer_id,
                    channel: order.channel,
                    amount: order.amount,
                    status: order.status
                  };

                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="size-3.5 text-muted-foreground shrink-0" />
                            <div className="font-mono text-[11px] text-foreground">
                              {order.displayId}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-foreground hidden sm:table-cell">
                          {order.customer}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {order.channel}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-foreground">
                          {order.formattedAmount}
                        </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.badgeVariant} size="sm">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">
                        {order.date}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <OrderRowActions order={orderDataToClient} customers={customers} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
