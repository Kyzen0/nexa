import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AiCommandLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-3 w-72" />
      </div>

      {/* Chat Area Skeleton */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-4 space-y-6 overflow-y-auto bg-muted/10">
          {/* Assistant Message Skeleton */}
          <div className="flex items-start gap-3">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 w-3/4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>
          
          {/* User Message Skeleton */}
          <div className="flex items-start gap-3 flex-row-reverse">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1 flex flex-col items-end">
              <Skeleton className="h-4 w-24" />
              <div className="bg-primary/10 rounded-2xl rounded-tr-sm p-4 w-1/2 space-y-3">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Input Area Skeleton */}
        <div className="p-4 border-t border-border bg-card">
          <div className="relative">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="absolute right-2 top-2">
              <Skeleton className="size-8 rounded-md" />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}
