import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    // 1. Verify the request comes from an authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch the user's workspace_id from their profile
    // We must delete their workspace and business data before deleting the profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Could not find user profile' }, { status: 404 });
    }

    const workspaceId = profile.workspace_id;

    // 3. Create a separate Supabase admin client to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment variables.");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 4. Delete the user's data in the correct order to respect constraints
    
    // A. Delete business data that references workspace_id or customer_id
    // Note: orders references customer_id with SET NULL, but we are deleting everything scoped to workspace_id.
    const tablesToDelete = [
      'orders',
      'customers',
      'products',
      'sales_channels',
      'goals',
      'ai_insights',
      'notifications',
      'reports'
    ];

    for (const table of tablesToDelete) {
      const { error: deleteDataError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('workspace_id', workspaceId);

      if (deleteDataError) {
        console.error(`Error deleting from ${table}:`, deleteDataError);
        return NextResponse.json({ error: `Failed to delete ${table} data` }, { status: 500 });
      }
    }

    // B. Delete the profile row (must happen before workspace because profile.workspace_id restricts workspace deletion)
    const { error: profileDeleteError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileDeleteError) {
      console.error('Error deleting profile:', profileDeleteError);
      return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 });
    }

    // C. Delete the workspace row
    const { error: workspaceDeleteError } = await supabaseAdmin
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (workspaceDeleteError) {
      console.error('Error deleting workspace:', workspaceDeleteError);
      return NextResponse.json({ error: 'Failed to delete workspace' }, { status: 500 });
    }

    // D. Finally, delete the actual auth account
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteUserError) {
      console.error('Error deleting auth user:', deleteUserError);
      return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Unhandled error during account deletion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
