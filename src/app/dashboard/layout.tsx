import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  const { count: activeGoalsCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'Achieved');

  return (
    <DashboardShell 
      unreadCount={unreadCount || 0} 
      activeGoalsCount={activeGoalsCount || 0} 
      userEmail={user.email}
    >
      {children}
    </DashboardShell>
  );
}
