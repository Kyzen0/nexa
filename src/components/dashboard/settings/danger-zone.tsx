"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";

export function DangerZone() {
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteAccount = async () => {
    if (confirmationText !== "DELETE") return;
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/delete-account', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      
      // Sign out locally
      await supabase.auth.signOut();
      
      // Redirect to login with deleted flag
      router.push('/login?deleted=true');
      router.refresh();
    } catch (error) {
      console.error("Account deletion failed:", error);
      setLoading(false);
    }
  };

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" />
          <span>Danger Zone</span>
        </CardTitle>
        <CardDescription className="text-destructive/80">
          Irreversible actions related to your workspace and account data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-background/50">
          <div>
            <h4 className="text-sm font-semibold text-foreground">Delete Account and Workspace</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently delete all your business data, integration tokens, and your user account. This action cannot be undone.
            </p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "ml-4 shrink-0 shadow-sm")}>
              <Trash2 className="size-4 mr-2" />
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogContent className="border-destructive/30">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="size-5" />
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action <strong>cannot</strong> be undone. This will permanently delete your user account, wipe your workspace, and erase all associated business data (customers, orders, products, goals, reports).
                </AlertDialogDescription>
                <div className="p-3 bg-muted/50 rounded-md border border-border mt-3">
                  <p className="text-xs font-medium mb-2 text-foreground">
                    Please type <span className="font-mono bg-destructive/10 text-destructive px-1.5 py-0.5 rounded font-bold">DELETE</span> to confirm.
                  </p>
                  <Input 
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="font-mono uppercase h-9"
                  />
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmationText("")}>Cancel</AlertDialogCancel>
                <Button 
                  variant="destructive" 
                  disabled={confirmationText !== "DELETE" || loading}
                  onClick={handleDeleteAccount}
                >
                  {loading ? "Deleting..." : "Permanently Delete"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
