"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addOrder(data: { customer_id: string; channel: string; amount: number; status: string }) {
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
    .from('orders')
    .insert([
      {
        ...data,
        workspace_id: profile.workspace_id
      }
    ]);

  if (error) {
    return { error: error.message };
  }

  const { data: customer } = await supabase
    .from('customers')
    .select('name')
    .eq('id', data.customer_id)
    .single();

  const customerName = customer?.name || "Customer";
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.amount);

  await supabase.from('notifications').insert([{
    workspace_id: profile.workspace_id,
    title: `New order from ${customerName}`,
    description: `A new order for ${formattedAmount} was placed.`,
    type: "info",
    badge_text: "Sales",
    is_read: false
  }]);

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateOrder(id: string, data: { customer_id: string; channel: string; amount: number; status: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('orders')
    .update(data)
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard');
  return { success: true };
}
