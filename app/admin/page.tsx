'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Shield, Trash2, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Post, Report, SuccessStory } from '@/types';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [pendingStories, setPendingStories] = useState<SuccessStory[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'reports' | 'stories'>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (data?.is_admin || user.email?.includes('admin')) {
      setIsAdmin(true);
      fetchAdminData();
    } else {
      router.push('/home');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);

    const { data: postsData } = await supabase
      .from('posts')
      .select('*, user:users(first_name, last_initial)')
      .order('created_at', { ascending: false });

    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    const { data: storiesData } = await supabase
      .from('success_stories')
      .select('*, user:users(first_name, last_initial)')
      .eq('approved', false)
      .order('created_at', { ascending: false });

    if (postsData) setPosts(postsData as Post[]);
    if (reportsData) setReports(reportsData as Report[]);
    if (storiesData) setPendingStories(storiesData as SuccessStory[]);

    setLoading(false);
  };

  const handleRemovePost = async (postId: string) => {
    await supabase.from('posts').update({ status: 'removed' }).eq('id', postId);
    fetchAdminData();
  };

  const handleHidePost = async (postId: string) => {
    await supabase.from('posts').update({ status: 'hidden' }).eq('id', postId);
    fetchAdminData();
  };

  const handleApproveStory = async (storyId: string) => {
    await supabase.from('success_stories').update({ approved: true }).eq('id', storyId);
    fetchAdminData();
  };

  const handleResolveReport = async (reportId: string) => {
    await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);
    fetchAdminData();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wf-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-wf-gold" />
            <h1 className="font-serif text-xl text-wf-ivory">Admin Panel</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="wf-card text-center">
            <div className="text-wf-ivory font-semibold text-xl">{posts.length}</div>
            <div className="text-gray-500 text-xs">Total Posts</div>
          </div>
          <div className="wf-card text-center">
            <div className="text-red-400 font-semibold text-xl">{reports.length}</div>
            <div className="text-gray-500 text-xs">Pending Reports</div>
          </div>
          <div className="wf-card text-center">
            <div className="text-wf-gold font-semibold text-xl">{pendingStories.length}</div>
            <div className="text-gray-500 text-xs">Pending Stories</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['posts', 'reports', 'stories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-wf-gold text-wf-black' 
                  : 'bg-wf-gray-light text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wf-card animate-pulse h-24"></div>
            ))}
          </div>
        ) : (
          <>
            {activeTab === 'posts' && posts.map((post) => (
              <div key={post.id} className="wf-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-wf-ivory font-medium">{post.location_name}</h3>
                    <p className="text-gray-500 text-xs">{post.city}, {post.state}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    post.status === 'active' ? 'bg-green-900/30 text-green-400' :
                    post.status === 'hidden' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleHidePost(post.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-900/30 text-yellow-400 rounded-lg text-xs hover:bg-yellow-900/50 transition-colors"
                  >
                    <EyeOff size={12} /> Hide
                  </button>
                  <button 
                    onClick={() => handleRemovePost(post.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'reports' && reports.map((report) => (
              <div key={report.id} className="wf-card">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-wf-ivory font-medium text-sm">Report #{report.id.slice(0, 8)}</h3>
                    <p className="text-gray-500 text-xs">Reason: {report.reason}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleResolveReport(report.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 text-green-400 rounded-lg text-xs hover:bg-green-900/50 transition-colors"
                >
                  <CheckCircle size={12} /> Resolve
                </button>
              </div>
            ))}

            {activeTab === 'stories' && pendingStories.map((story) => (
              <div key={story.id} className="wf-card">
                <h3 className="text-wf-ivory font-medium mb-1">{story.title}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{story.story}</p>
                <p className="text-gray-500 text-xs mb-3">{story.city}, {story.state}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApproveStory(story.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 text-green-400 rounded-lg text-xs hover:bg-green-900/50 transition-colors"
                  >
                    <CheckCircle size={12} /> Approve
                  </button>
                  <button 
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg text-xs hover:bg-red-900/50 transition-colors"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
