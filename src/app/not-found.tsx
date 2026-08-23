import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 sm:p-8">
      <Card className="w-full max-w-lg shadow-2xl border-border/60">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="flex size-12 items-center justify-center rounded-xl bg-foreground text-background font-semibold text-xl tracking-wider shadow-md">
              NX
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            404 — Page not found
          </CardTitle>
          <CardDescription className="text-center text-sm">
            The page you're looking for doesn't exist or may have moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 sm:px-10 pb-10 flex justify-center">
          {/* The middleware will automatically redirect unauthenticated users to /login if they hit /dashboard */}
          <Link href="/dashboard" className={cn(buttonVariants(), "h-10 text-[13px] font-medium px-4")}>
            <Home className="mr-2 size-4" />
            Return to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
