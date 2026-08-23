"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateWorkspaceName(newName: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get the user's workspace_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.workspace_id) {
    throw new Error("Could not find workspace");
  }

  // Update workspace name
  const { error } = await supabase
    .from('workspaces')
    .update({ name: newName })
    .eq('id', profile.workspace_id);

  if (error) {
    throw new Error(error.message);
  }

  // Revalidate layout to update sidebar
  revalidatePath('/dashboard', 'layout');
  
  return { success: true };
}
