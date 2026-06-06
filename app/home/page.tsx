'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import PostCard from '@/components/PostCard';
import StateSelector from '@/components/StateSelector';
import { Plus, Bell, MapPin, ChevronDown } from 'lucide-react';
import { Post } from '@/types';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}

function HomeContent() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [selectedState, selectedCity]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, user:users(first_name, last_initial)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    if (selectedState) query = query.eq('state', selectedState);
    if (selectedCity) query = query.eq('city', selectedCity);

    const { data, error } = await query;
    if (!error && data) setPosts(data as Post[]);
    setLoading(false);
  };

  const handleReply = (postId: string) => {
    window.location.href = `/messages?post=${postId}`;
  };

  const handleDelete = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-wf-gray-light">
              <span className="font-serif text-sm text-wf-ivory">W<span className="relative">F<span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 bg-wf-gold rounded-full"></span></span></span>
            </div>
            <span className="font-serif text-lg text-wf-ivory">What If?</span>
          </div>
          <button className="p-2 hover:bg-wf-gray rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-wf-gold rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Post CTA */}
        <Link href="/post" className="wf-card flex items-center gap-4 hover:border-wf-gold transition-colors">
          <div className="w-12 h-12 bg-wf-gold/10 rounded-xl flex items-center justify-center shrink-0">
            <Plus size={24} className="text-wf-gold" />
          </div>
          <div>
            <h2 className="text-wf-ivory font-medium">Post a Missed Connection</h2>
            <p className="text-gray-500 text-sm">Share someone you can't stop thinking about.</p>
          </div>
        </Link>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <StateSelector
            value={selectedState}
            onChange={setSelectedState}
            placeholder="All States"
          />
          <div className="relative">
            <input
              type="text"
              placeholder="City"
              className="wf-input"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Feed */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl text-wf-ivory">For You</h2>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
            <span className="text-gray-500 text-sm">{posts.length} connections</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="wf-card animate-pulse h-40"></div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No connections yet in this area.</p>
              <Link href="/post" className="text-wf-gold hover:text-wf-gold-light">
                Be the first to post →
              </Link>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onReply={handleReply} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
