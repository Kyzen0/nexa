"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addProduct(data: { name: string; category: string; description: string; status: string; monthly_sales_volume: number; margin_percentage: number }) {
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
    .from('products')
    .insert([
      {
        ...data,
        workspace_id: profile.workspace_id
      }
    ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function updateProduct(id: string, data: { name: string; category: string; description: string; status: string; monthly_sales_volume: number; margin_percentage: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/products');
  return { success: true };
}
