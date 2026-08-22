"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteOrder } from "@/app/actions/orders";
import { OrderDialog } from "./order-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function OrderRowActions({ order, customers }: { order: any; customers: any[] }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteOrder(order.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-7 text-muted-foreground hover:text-foreground")}
          onClick={() => setIsEditOpen(true)}
          title="Edit Order"
        >
          <Edit className="size-3.5" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-7 text-muted-foreground hover:text-destructive")}
            title="Delete Order"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this order?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the order
                and remove its transaction data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <OrderDialog 
        order={order} 
        customers={customers}
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
    </>
  );
}
