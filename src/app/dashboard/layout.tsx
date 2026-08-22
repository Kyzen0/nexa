import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard | Nexa Enterprise SaaS",
  description: "High-density enterprise orchestration and telemetry dashboard.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/login");
  }

  console.log(`[DEBUG] Fetching badge counts for user: ${user.id}`);

  const { count: unreadCount, error: unreadError } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
    
  console.log(`[DEBUG] Notifications count: ${unreadCount}, Error:`, unreadError);

  const { count: activeGoalsCount, error: goalsError } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'Achieved');
    
  console.log(`[DEBUG] Goals count: ${activeGoalsCount}, Error:`, goalsError);

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspaces(name)')
    .eq('id', user.id)
    .single();

  const workspaceName = (profile?.workspaces as any)?.name || "My Business";

  if (workspaceName === "My Business") {
    redirect("/onboarding");
  }

  return (
    <DashboardShell 
      unreadCount={unreadCount || 0} 
      activeGoalsCount={activeGoalsCount || 0} 
      userEmail={user.email}
      workspaceName={workspaceName}
    >
      {children}
    </DashboardShell>
  );
}
