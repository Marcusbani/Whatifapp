'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { Settings, Shield, LogOut, FileText, MessageSquare, ChevronRight, BadgeCheck, Edit3, Lock, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [postCount, setPostCount] = useState(0);
  const [replyCount, setReplyCount] = useState(0);
  const [storyCount, setStoryCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) setProfile(data);

    const { count: posts } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    const { count: replies } = await supabase
      .from('replies')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', user?.id);

    const { count: stories } = await supabase
      .from('success_stories')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    const { count: likes } = await supabase
      .from('posts')
      .select('likes_count', { count: 'exact', head: true })
      .eq('user_id', user?.id);

    setPostCount(posts || 0);
    setReplyCount(replies || 0);
    setStoryCount(stories || 0);
    setLikeCount(likes || 0);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="font-serif text-xl text-wf-ivory">Profile</h1>
          <button className="p-2 hover:bg-wf-gray rounded-lg transition-colors">
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-wf-gray-light rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-wf-gold/30">
            <span className="font-serif text-3xl text-wf-ivory">
              {profile.first_name?.charAt(0)}{profile.last_initial}
            </span>
          </div>
          <h2 className="font-serif text-2xl text-wf-ivory">
            {profile.first_name} {profile.last_initial}.
          </h2>
          <p className="text-gray-500 text-sm mt-1">{profile.city}, {profile.state}</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">{profile.bio || 'Entrepreneur. Coffee addict. Always open to new connections.'}</p>

          {profile.verification_badge && (
            <div className="flex items-center justify-center gap-1 mt-3">
              <BadgeCheck size={16} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Verified Human</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-wf-ivory font-semibold text-lg">{postCount}</div>
            <div className="text-gray-500 text-xs">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-wf-ivory font-semibold text-lg">{replyCount}</div>
            <div className="text-gray-500 text-xs">Replies</div>
          </div>
          <div className="text-center">
            <div className="text-wf-ivory font-semibold text-lg">{storyCount}</div>
            <div className="text-gray-500 text-xs">Stories</div>
          </div>
          <div className="text-center">
            <div className="text-wf-ivory font-semibold text-lg">{likeCount}</div>
            <div className="text-gray-500 text-xs">Likes</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left">
            <Edit3 size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Edit Profile</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button 
            onClick={() => router.push('/verify')}
            className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
          >
            <Shield size={18} className="text-wf-gold" />
            <div className="flex-1">
              <span className="text-wf-ivory">Verification Badge</span>
              <p className="text-gray-500 text-xs">Verified via Facebook</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left">
            <Settings size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Account Settings</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left">
            <Lock size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Privacy & Safety</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left">
            <HelpCircle size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Help & Support</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full py-3 text-red-400 text-sm font-medium hover:text-red-300 transition-colors"
        >
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
