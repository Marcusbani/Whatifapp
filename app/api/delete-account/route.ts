import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        { error: 'Missing Supabase server environment variables' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await supabaseAdmin.from('reports').delete().eq('reporter_id', userId);
    await supabaseAdmin.from('blocks').delete().or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`);
    await supabaseAdmin.from('success_stories').delete().eq('user_id', userId);
    await supabaseAdmin.from('replies').delete().eq('sender_id', userId);
    await supabaseAdmin.from('posts').delete().eq('user_id', userId);
    await supabaseAdmin.from('users').delete().eq('id', userId);

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      return NextResponse.json(
        { error: 'Failed to delete auth user: ' + authError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
