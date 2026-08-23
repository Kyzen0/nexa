"use server";

import { createClient } from "@/lib/supabase/server";

export async function markPasswordAsSet() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from('profiles')
    .update({ has_password: true })
    .eq('id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
