"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "./product-dialog";

export function ProductAddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setIsOpen(true)}>
        <Plus className="size-3.5" />
        <span>Add Product</span>
      </Button>
      <ProductDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
