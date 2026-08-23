"use client";

import { useState } from "react";
import { CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/app/actions/notifications";
import { useRouter } from "next/navigation";

export function MarkAllReadButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await markAllAsRead();
      router.refresh();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-1.5 text-xs" 
      onClick={handleMarkAllAsRead}
      disabled={loading}
    >
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCheck className="size-3.5" />}
      <span>{loading ? "Marking..." : "Mark all as read"}</span>
    </Button>
  );
}
