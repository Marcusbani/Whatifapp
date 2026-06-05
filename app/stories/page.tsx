'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { BookOpen, Heart, MapPin, Clock } from 'lucide-react';
import { SuccessStory } from '@/types';

export default function StoriesPage() {
  return (
    <ProtectedRoute>
      <StoriesContent />
    </ProtectedRoute>
  );
}

function StoriesContent() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*, user:users(first_name, last_initial)')
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) setStories(data as SuccessStory[]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3">
          <h1 className="font-serif text-xl text-wf-ivory">Success Stories</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wf-card animate-pulse h-48"></div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No stories yet</p>
            <p className="text-gray-600 text-sm">Be the first to share your success story</p>
          </div>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="wf-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-lg text-wf-ivory">{story.title}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <MapPin size={14} />
                    <span>{story.city}, {story.state}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock size={12} />
                  <span>{new Date(story.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                "{story.story}"
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-wf-gray-light">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-wf-gray-light rounded-full flex items-center justify-center">
                    <span className="text-wf-ivory text-xs">
                      {story.user?.first_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {story.user?.first_name || 'Anonymous'} {story.user?.last_initial || ''}.
                  </span>
                </div>
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <Heart size={14} /> 24
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
