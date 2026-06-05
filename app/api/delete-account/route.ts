import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Service role client — server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 1. Delete user's reports (where they are reporter)
    await supabaseAdmin
      .from('reports')
      .delete()
      .eq('reporter_id', userId);

    // 2. Delete user's blocks
    await supabaseAdmin
      .from('blocks')
      .delete()
      .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);

    // 3. Delete user's success stories
    await supabaseAdmin
      .from('success_stories')
      .delete()
      .eq('user_id', userId);

    // 4. Delete user's replies
    await supabaseAdmin
      .from('replies')
      .delete()
      .eq('sender_id', userId);

    // 5. Delete user's posts (and cascade replies if not handled above)
    await supabaseAdmin
      .from('posts')
      .delete()
      .eq('user_id', userId);

    // 6. Delete user profile
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    // 7. Delete the actual Supabase Auth user (requires service role)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Auth delete error:', authError);
      return NextResponse.json(
        { error: 'Failed to delete auth user: ' + authError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete account error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
