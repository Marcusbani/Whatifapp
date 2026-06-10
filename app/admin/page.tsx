'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import { 
  ArrowLeft, Users, FileText, Flag, Shield, 
  Trash2, UserX, Eye, CheckCircle, Clock, AlertTriangle,
  Search, Filter
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_initial: string;
  created_at: string;
  status: string;
}

interface Post {
  id: string;
  location_name: string;
  city: string;
  state: string;
  description: string;
  created_at: string;
  user_id: string;
  status: string;
}

interface Report {
  id: string;
  subject: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
  email: string | null;
  user_id: string | null;
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([] as User[]);
  const [posts, setPosts] = useState([] as Post[]);
  const [reports, setReports] = useState([] as Report[]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAdmin();
    fetchData();
  }, [activeTab]);

  const checkAdmin = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data?.role !== 'admin') {
      router.push('/home');
    }
  };

  const fetchData = async () => {
    setLoading(true);

    if (activeTab === 'users') {
      const { data } = await supabase
        .from('users')
        .select('id, email, first_name, last_initial, created_at, status')
        .order('created_at', { ascending: false });
      setUsers(data || []);
    } else if (activeTab === 'posts') {
      const { data } = await supabase
        .from('posts')
        .select('id, location_name, city, state, description, created_at, user_id, status')
        .order('created_at', { ascending: false });
      setPosts(data || []);
    } else if (activeTab === 'reports') {
      const { data } = await supabase
        .from('bug_reports')
        .select('*')
        .order('created_at', { ascending: false });
      setReports(data || []);
    }

    setLoading(false);
  };

  const deletePost = async (postId: string) => {
    await supabase.from('posts').delete().eq('id', postId);
    fetchData();
  };

  const suspendUser = async (userId: string) => {
    await supabase.from('users').update({ status: 'suspended' }).eq('id', userId);
    fetchData();
  };

  const banUser = async (userId: string) => {
    await supabase.from('users').update({ status: 'banned' }).eq('id', userId);
    fetchData();
  };

  const deleteUser = async (userId: string) => {
    await supabase.from('users').delete().eq('id', userId);
    fetchData();
  };

  const markReportReviewed = async (reportId: string) => {
    await supabase.from('bug_reports').update({ status: 'reviewed' }).eq('id', reportId);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/home')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Admin Dashboard</h1>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'posts', label: 'Posts', icon: FileText },
            { id: 'reports', label: 'Reports', icon: Flag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-wf-gold text-wf-black' 
                  : 'bg-wf-gray text-gray-400 hover:text-wf-ivory'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-wf-gray-light border border-wf-gray rounded-lg pl-10 pr-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-wf-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="space-y-3">
                {users.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No users found</p>
                ) : (
                  users.map((u) => (
                    <div key={u.id} className="wf-card space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-wf-ivory font-medium">{u.first_name} {u.last_initial}.</p>
                          <p className="text-gray-500 text-sm">{u.email}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          u.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          u.status === 'suspended' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {u.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => suspendUser(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs hover:bg-yellow-500/30">
                          <Shield size={12} /> Suspend
                        </button>
                        <button onClick={() => banUser(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30">
                          <UserX size={12} /> Ban
                        </button>
                        <button onClick={() => deleteUser(u.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                      <p className="text-gray-600 text-xs">Joined {formatDate(u.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="space-y-3">
                {posts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No posts found</p>
                ) : (
                  posts.map((p) => (
                    <div key={p.id} className="wf-card space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-wf-ivory font-medium">{p.location_name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          p.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{p.city}, {p.state}</p>
                      <p className="text-gray-300 text-sm line-clamp-2">"{p.description}"</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-gray-600 text-xs">{formatDate(p.created_at)}</p>
                        <button onClick={() => deletePost(p.id)} className="flex items-center gap-1 text-red-400 text-xs hover:text-red-300">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reports found</p>
                ) : (
                  reports.map((r) => (
                    <div key={r.id} className="wf-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flag size={14} className="text-wf-gold" />
                          <p className="text-wf-ivory text-sm font-medium">{r.subject}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          r.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' :
                          r.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{r.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="text-gray-600 text-xs">
                          <span className="capitalize">{r.type}</span> • {formatDate(r.created_at)}
                          {r.email && ` • ${r.email}`}
                        </div>
                        {r.status === 'open' && (
                          <button onClick={() => markReportReviewed(r.id)} className="flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300">
                            <CheckCircle size={12} /> Mark Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
