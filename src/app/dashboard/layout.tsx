import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";

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
  
  const { count: unreadCount } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  return <DashboardShell unreadCount={unreadCount || 0}>{children}</DashboardShell>;
}
