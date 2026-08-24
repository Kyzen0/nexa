"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChannelDialog } from "./channel-dialog";

export function ChannelAddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-1.5 text-xs" onClick={() => setIsOpen(true)}>
        <Plus className="size-3.5" />
        <span>Add Channel</span>
      </Button>
      <ChannelDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
