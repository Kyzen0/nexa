"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('deleted') === 'true') {
        setIsDeleted(true);
      }
    }
  }, []);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("Invalid email or password.");
      } else {
        setError(error.message);
      }
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
          <CardTitle className="text-3xl font-bold tracking-tight text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-sm">
            Enter your credentials to access your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10 pb-10">
          {isDeleted && (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 p-3 rounded-md mb-6">
              <CheckCircle2 className="size-4 shrink-0" />
              <p>Your account and all associated data have been permanently deleted.</p>
            </div>
          )}

          <Button variant="outline" className="w-full mb-6 h-10 text-[13px] font-medium border-border/60" onClick={handleGoogleLogin} disabled={loading} type="button">
            <GoogleIcon className="size-4 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-wider">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@nexa.dev"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-[11px] font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="size-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full h-10 mt-2 text-[13px] font-medium" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 p-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
