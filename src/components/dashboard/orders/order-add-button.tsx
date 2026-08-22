"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDialog } from "./order-dialog";

export function OrderAddButton({ customers }: { customers: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setIsOpen(true)}>
        <Plus className="size-3.5" />
        <span>Add Order</span>
      </Button>
      <OrderDialog 
        customers={customers} 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
}
