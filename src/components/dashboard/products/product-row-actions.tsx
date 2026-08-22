"use client";

import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteProduct } from "@/app/actions/products";
import { ProductDialog } from "./product-dialog";
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

export function ProductRowActions({ product }: { product: any }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProduct(product.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-7 text-muted-foreground hover:text-foreground")}
          onClick={() => setIsEditOpen(true)}
          title="Edit Product"
        >
          <Edit className="size-3.5" />
        </button>

        <AlertDialog>
          <AlertDialogTrigger 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-7 text-muted-foreground hover:text-destructive")}
            title="Delete Product"
          >
            {isDeleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete {product.name}?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the product
                and remove its data from our servers.
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

      <ProductDialog 
        product={product} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
    </>
  );
}
