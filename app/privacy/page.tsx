'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Shield, Lock, Eye, EyeOff, UserX, AlertTriangle, ChevronRight } from 'lucide-react';

interface BlockedUser {
  id: string;
  blocked_id: string;
  created_at: string;
  blocked_profile: {
    first_name: string;
    last_initial: string;
  } | null;
}

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <PrivacyContent />
    </ProtectedRoute>
  );
}

function PrivacyContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    if (user) fetchBlockedUsers();
  }, [user]);

  const fetchBlockedUsers = async () => {
    const { data } = await supabase
      .from('blocks')
      .select(`
        id,
        blocked_id,
        created_at,
        blocked_profile:users!blocks_blocked_id_fkey(first_name, last_initial)
      `)
      .eq('blocker_id', user?.id);

    setBlockedUsers(data || []);
    setLoading(false);
  };

  const unblockUser = async (blockId: string) => {
    await supabase.from('blocks').delete().eq('id', blockId);
    await fetchBlockedUsers();
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Privacy & Safety</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Privacy Settings */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Privacy</h2>

          <div className="wf-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-gray-400" />
              <div>
                <span className="text-wf-ivory">Profile Visibility</span>
                <p className="text-gray-500 text-xs">Public — anyone can see your posts</p>
              </div>
            </div>
            <span className="text-wf-gold text-xs font-medium">Public</span>
          </div>
        </div>

        {/* Safety Settings */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Safety</h2>

          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className="wf-card w-full flex items-center justify-between hover:border-wf-gold transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <UserX size={18} className="text-gray-400" />
              <div>
                <span className="text-wf-ivory">Blocked Users</span>
                <p className="text-gray-500 text-xs">{blockedUsers.length} blocked</p>
              </div>
            </div>
            {showBlocked ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
          </button>

          {showBlocked && (
            <div className="space-y-2">
              {loading ? (
                <p className="text-gray-500 text-sm text-center py-4">Loading...</p>
              ) : blockedUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No blocked users</p>
              ) : (
                blockedUsers.map((block) => (
                  <div key={block.id} className="wf-card flex items-center justify-between">
                    <span className="text-wf-ivory">
                      {block.blocked_profile?.first_name} {block.blocked_profile?.last_initial}.
                    </span>
                    <button
                      onClick={() => unblockUser(block.id)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="wf-card flex items-center gap-3 border-wf-gold/20 bg-wf-gold/5">
            <AlertTriangle size={18} className="text-wf-gold" />
            <div>
              <span className="text-wf-gold font-medium">Report Center</span>
              <p className="text-gray-500 text-xs">View and manage your reports</p>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Data</h2>

          <button className="wf-card w-full flex items-center gap-3 hover:border-wf-gold transition-colors text-left">
            <Lock size={18} className="text-gray-400" />
            <div className="flex-1">
              <span className="text-wf-ivory">Download My Data</span>
              <p className="text-gray-500 text-xs">Get a copy of your account data</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
