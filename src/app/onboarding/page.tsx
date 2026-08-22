"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function OnboardingPage() {
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    if (!profile?.workspace_id) {
      setError("No workspace linked to this profile.");
      setLoading(false);
      return;
    }

    const updateResult = await supabase
      .from('workspaces')
      .update({ name: businessName.trim() })
      .eq('id', profile.workspace_id);

    console.log('[DEBUG] workspaces update result:', updateResult);

    if (updateResult.error) {
      setError(updateResult.error.message);
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
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Welcome to Nexa</CardTitle>
          <CardDescription className="text-center text-sm">
            Let's set up your workspace to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10 pb-10">
          <form onSubmit={handleContinue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">What's your business called?</Label>
              <Input
                id="businessName"
                type="text"
                placeholder="Acme Corp"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-10"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-10 mt-2 text-[13px] font-medium" disabled={loading || !businessName.trim()}>
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
