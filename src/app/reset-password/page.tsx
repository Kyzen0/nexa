"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const pwdHasLength = password.length >= 8;
  const pwdHasUpper = /[A-Z]/.test(password);
  const pwdHasNumber = /[0-9]/.test(password);
  const pwdHasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordValid = pwdHasLength && pwdHasUpper && pwdHasNumber && pwdHasSpecial;
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = isPasswordValid && doPasswordsMatch;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 sm:p-8">
      <Card className="w-full max-w-lg shadow-2xl border-border/60">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background font-semibold text-xl tracking-wider shadow-md">
              NX
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Set new password</CardTitle>
          <CardDescription className="text-center text-sm">
            Choose a new, strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10 pb-10">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10"
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

            <Button type="submit" className="w-full h-10 mt-2 text-[13px] font-medium" disabled={loading || !isFormValid}>
              {loading ? "Updating password..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
