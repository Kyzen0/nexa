"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReport(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();

  if (!profile?.workspace_id) throw new Error("Workspace not found");

  const { error } = await supabase.from('reports').insert({
    workspace_id: profile.workspace_id,
    title: formData.get("title") as string,
    period: formData.get("period") as string,
    format: formData.get("format") as string,
    status: formData.get("status") as string,
    file_size_bytes: 0, // Since we don't have real files
  });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/reports');
  return { success: true };
}

export async function updateReport(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('reports')
    .update({
      title: formData.get("title") as string,
      period: formData.get("period") as string,
      format: formData.get("format") as string,
      status: formData.get("status") as string,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/reports');
  return { success: true };
}

export async function deleteReport(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('reports')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/reports');
  return { success: true };
}
