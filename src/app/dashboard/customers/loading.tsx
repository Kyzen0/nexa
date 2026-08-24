import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CustomersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24 mb-1" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-2.5 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-full sm:w-64" />
          </div>
        </CardHeader>
        <div className="border-t border-border">
          <div className="flex flex-col">
            {/* Table Header row */}
            <div className="hidden sm:grid sm:grid-cols-5 gap-4 px-4 py-3 border-b border-border bg-muted/40">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col sm:grid sm:grid-cols-5 gap-4 px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-3.5 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-20 mt-1 sm:mt-0" />
                <Skeleton className="h-3 w-16 mt-1 sm:mt-0" />
                <Skeleton className="h-3 w-12 mt-1 sm:mt-0" />
                <Skeleton className="h-3 w-20 mt-1 sm:mt-0" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
