"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markAllAsRead() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();

  if (!profile?.workspace_id) throw new Error("No workspace found");

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('workspace_id', profile.workspace_id)
    .eq('is_read', false);

  if (error) throw new Error("Failed to mark notifications as read: " + error.message);

  revalidatePath('/dashboard/notifications');
  revalidatePath('/dashboard', 'layout');
}
