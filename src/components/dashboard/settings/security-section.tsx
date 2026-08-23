"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordDialog } from "@/components/dashboard/settings/change-password-dialog";

export function SecuritySection({ hasPassword }: { hasPassword: boolean }) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const isOAuthOnly = !hasPassword;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>
            Manage your authentication methods and account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border/60 bg-muted/20">
            <div>
              <h4 className="text-sm font-semibold text-foreground">Password Management</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {isOAuthOnly 
                  ? "You're signed in with a third-party provider. Set a password to also enable email/password sign-in as a backup."
                  : "Update your password to keep your account secure."}
              </p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 shrink-0 shadow-sm gap-1.5"
              onClick={() => setShowPasswordDialog(true)}
            >
              <KeyRound className="size-3.5" />
              <span>{isOAuthOnly ? "Set Password" : "Change Password"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ChangePasswordDialog 
        open={showPasswordDialog} 
        onOpenChange={setShowPasswordDialog}
        mode={isOAuthOnly ? "set" : "change"}
      />
    </>
  );
}
