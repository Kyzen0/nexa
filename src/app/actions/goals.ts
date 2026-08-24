"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGoal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('profiles')
    .select('workspace_id')
    .eq('id', user.id)
    .single();

  if (!profile?.workspace_id) throw new Error("Workspace not found");

  const { error } = await supabase.from('goals').insert({
    workspace_id: profile.workspace_id,
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    target_value: formData.get("target_value") as string,
    current_value: formData.get("current_value") as string,
    progress_percentage: Number(formData.get("progress_percentage")),
    status: formData.get("status") as string,
    deadline: formData.get("deadline") as string,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout'); // Revalidate layout to update sidebar active goals count
  return { success: true };
}

export async function updateGoal(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: currentGoal } = await supabase
    .from('goals')
    .select('status, workspace_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('goals')
    .update({
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      target_value: formData.get("target_value") as string,
      current_value: formData.get("current_value") as string,
      progress_percentage: Number(formData.get("progress_percentage")),
      status: formData.get("status") as string,
      deadline: formData.get("deadline") as string,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  if (currentGoal) {
    const newStatus = formData.get("status") as string;
    if (newStatus === "Achieved" && currentGoal.status !== "Achieved") {
      await supabase.from('notifications').insert([{
        workspace_id: currentGoal.workspace_id,
        title: `Goal achieved: ${formData.get("title")}`,
        description: "Congratulations! A milestone has been reached.",
        type: "success",
        badge_text: "Milestone",
        is_read: false
      }]);
    }
  }

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
