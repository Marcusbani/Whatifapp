'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import PostCard from '@/components/PostCard';
import StateSelector from '@/components/StateSelector';
import { Filter, TrendingUp, Clock, Heart, Search, SlidersHorizontal, X } from 'lucide-react';
import { Post } from '@/types';

export default function BrowsePage() {
  return (
    <ProtectedRoute>
      <BrowseContent />
    </ProtectedRoute>
  );
}

function BrowseContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'newest' | 'popular' | 'liked'>('newest');
  const [selectedState, setSelectedState] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMe, setShowMe] = useState<'everyone' | 'replies' | 'men'>('everyone');
  const [dateFilter, setDateFilter] = useState<'anytime' | 'today' | 'thisweek' | 'custom'>('anytime');

  useEffect(() => {
    fetchPosts();
  }, [filter, selectedState]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, user:users(first_name, last_initial)')
      .eq('status', 'active');

    if (selectedState) query = query.eq('state', selectedState);

    if (filter === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (filter === 'popular') {
      query = query.order('views_count', { ascending: false });
    } else if (filter === 'liked') {
      query = query.order('likes_count', { ascending: false });
    }

    const { data, error } = await query.limit(50);
    if (!error && data) setPosts(data as Post[]);
    setLoading(false);
  };

  const handleReply = (postId: string) => {
    window.location.href = `/messages?post=${postId}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3">
          <h1 className="font-serif text-xl text-wf-ivory">Browse Connections</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search locations or keywords"
            className="wf-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
              showFilters ? 'border-wf-gold text-wf-gold' : 'border-wf-gray-light text-gray-400'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          <button
            onClick={() => setFilter('newest')}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
              filter === 'newest' ? 'border-wf-gold text-wf-gold' : 'border-wf-gray-light text-gray-400'
            }`}
          >
            Newest
          </button>

          <button
            onClick={() => setFilter('popular')}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
              filter === 'popular' ? 'border-wf-gold text-wf-gold' : 'border-wf-gray-light text-gray-400'
            }`}
          >
            Most Viewed
          </button>

          <button
            onClick={() => setFilter('liked')}
            className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
              filter === 'liked' ? 'border-wf-gold text-wf-gold' : 'border-wf-gray-light text-gray-400'
            }`}
          >
            Most Liked
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="wf-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-wf-ivory font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-wf-ivory">
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Location</label>
              <StateSelector
                value={selectedState}
                onChange={setSelectedState}
                placeholder="All States"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">City (Optional)</label>
              <input type="text" placeholder="Search city" className="wf-input" />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Show Me</label>
              <div className="flex gap-2">
                {(['everyone', 'replies', 'men'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowMe(option)}
                    className={`px-4 py-2 rounded-full border text-sm capitalize transition-colors ${
                      showMe === option ? 'border-wf-gold text-wf-gold bg-wf-gold/10' : 'border-wf-gray-light text-gray-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Sort By</label>
              <div className="flex gap-2">
                {(['newest', 'mostviewed', 'mostliked'] as const).map((option) => (
                  <button
                    key={option}
                    className={`px-4 py-2 rounded-full border text-sm capitalize transition-colors ${
                      option === 'newest' ? 'border-wf-gold text-wf-gold bg-wf-gold/10' : 'border-wf-gray-light text-gray-400'
                    }`}
                  >
                    {option === 'mostviewed' ? 'Most Viewed' : option === 'mostliked' ? 'Most Liked' : option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <div className="flex gap-2 flex-wrap">
                {(['anytime', 'today', 'thisweek', 'custom'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => setDateFilter(option)}
                    className={`px-4 py-2 rounded-full border text-sm capitalize transition-colors ${
                      dateFilter === option ? 'border-wf-gold text-wf-gold bg-wf-gold/10' : 'border-wf-gray-light text-gray-400'
                    }`}
                  >
                    {option === 'thisweek' ? 'This Week' : option}
                  </button>
                ))}
              </div>
            </div>

            <button className="wf-btn-primary">Apply Filters</button>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wf-card animate-pulse h-40"></div>
            ))}
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onReply={handleReply} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
