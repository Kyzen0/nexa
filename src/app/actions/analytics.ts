"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addChannel(data: { name: string; monthly_orders: number; gross_revenue: number; net_margin_percentage: number; growth_mom_percentage: number }) {
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
    .from('sales_channels')
    .insert([
      {
        ...data,
        workspace_id: profile.workspace_id
      }
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/analytics');
  return { success: true };
}

export async function updateChannel(id: string, data: { name: string; monthly_orders: number; gross_revenue: number; net_margin_percentage: number; growth_mom_percentage: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('sales_channels')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/analytics');
  return { success: true };
}

export async function deleteChannel(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('sales_channels')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/analytics');
  return { success: true };
}
