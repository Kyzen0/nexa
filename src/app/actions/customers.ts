"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(data: { name: string; contact_email: string; tier: string; status: string; joined_at: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();

  if (!profile?.workspace_id) {
    return { error: "No workspace linked to this profile" };
  }

  const { error } = await supabase
    .from('customers')
    .insert([
      {
        ...data,
        workspace_id: profile.workspace_id
      }
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/customers');
  return { success: true };
}

export async function updateCustomer(id: string, data: { name: string; contact_email: string; tier: string; status: string; joined_at: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/customers');
  return { success: true };
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/customers');
  return { success: true };
}
