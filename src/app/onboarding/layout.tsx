import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspaces(name)')
    .eq('id', user.id)
    .single();

  const workspaceName = (profile?.workspaces as any)?.name;
  if (workspaceName && workspaceName !== "My Business") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
