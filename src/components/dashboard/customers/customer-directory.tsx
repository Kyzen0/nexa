"use client";

import React, { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomerAddButton } from "@/components/dashboard/customers/customer-add-button";
import { CustomerRowActions } from "@/components/dashboard/customers/customer-row-actions";
import { Button } from "@/components/ui/button";

interface CustomerData {
  id: string;
  name: string;
  contact: string;
  tier: string;
  orders: number;
  rawLtv: number;
  ltv: string;
  status: string;
  badgeVariant: "success" | "warning" | "destructive" | "secondary";
  joined: string;
}

export function CustomerDirectory({ customers }: { customers: CustomerData[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredCustomers = customers.filter((org) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return org.name.toLowerCase().includes(q) || org.contact.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
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
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Building2 className="size-8 text-muted-foreground/30" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">No customers yet</p>
                        <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                          Add your first customer to start tracking relationships and LTV.
                        </p>
                      </div>
                      <div className="pt-2">
                        <CustomerAddButton />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground">
                    No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((org) => (
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
