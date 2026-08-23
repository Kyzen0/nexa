"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { markPasswordAsSet } from "@/app/actions/profile";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "change"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "change" | "set";
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const pwdHasLength = password.length >= 8;
  const pwdHasUpper = /[A-Z]/.test(password);
  const pwdHasNumber = /[0-9]/.test(password);
  const pwdHasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = pwdHasLength && pwdHasUpper && pwdHasNumber && pwdHasSpecial;
  const doPasswordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || !doPasswordsMatch) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      if (mode === "set") {
        await markPasswordAsSet();
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      router.refresh();
      setTimeout(() => {
        onOpenChange(false);
        setPassword("");
        setConfirmPassword("");
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || `Failed to ${mode} password`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px] border-border/60">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            {mode === "set" ? "Set Password" : "Change Password"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {mode === "set" 
              ? "Set a password for your account to enable email/password login as an additional sign-in method."
              : "Update your account password. Use a strong password that you don't use elsewhere."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {success ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <CheckCircle2 className="size-8 text-emerald-500" />
            </div>
            <p className="text-sm font-medium">Password updated successfully</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">{mode === "set" ? "Password" : "New Password"}</Label>
              <PasswordInput
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <div className="flex flex-col gap-1 text-[11px] mt-2 bg-muted/40 p-2.5 rounded-md border border-border">
                <span className={pwdHasLength ? "text-emerald-500 flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}>
                  <CheckCircle2 className="size-3 shrink-0" /> At least 8 characters
                </span>
                <span className={pwdHasUpper ? "text-emerald-500 flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}>
                  <CheckCircle2 className="size-3 shrink-0" /> One uppercase letter
                </span>
                <span className={pwdHasNumber ? "text-emerald-500 flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}>
                  <CheckCircle2 className="size-3 shrink-0" /> One number
                </span>
                <span className={pwdHasSpecial ? "text-emerald-500 flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}>
                  <CheckCircle2 className="size-3 shrink-0" /> One special character
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="text-[11px] text-destructive mt-1">Passwords do not match.</p>
              )}
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
  
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loading || !isPasswordValid || !doPasswordsMatch}
              >
                {loading ? <Loader2 className="mr-2 size-3.5 animate-spin" /> : null}
                {mode === "set" 
                  ? (loading ? "Setting..." : "Set Password") 
                  : (loading ? "Updating..." : "Update Password")}
              </Button>
            </div>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
