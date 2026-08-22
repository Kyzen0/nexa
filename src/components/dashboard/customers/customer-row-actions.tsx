"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteCustomer } from "@/app/actions/customers";
import { CustomerDialog } from "./customer-dialog";
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

export function CustomerRowActions({ customer }: { customer: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCustomer(customer.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-7 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditOpen(true)}
          title="Edit Customer"
        >
          <Edit className="size-3.5" />
        </Button>

        <AlertDialog>
          <AlertDialogTrigger 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-7 text-muted-foreground hover:text-destructive")}
            title="Delete Customer"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete {customer.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the customer
                and remove their data from our servers.
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

      <CustomerDialog 
        customer={customer} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
    </>
  );
}
