'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import StateSelector from '@/components/StateSelector';
import { ArrowLeft, MapPin, Calendar, Clock, Eye, EyeOff } from 'lucide-react';

export default function PostPage() {
  return (
    <ProtectedRoute>
      <PostContent />
    </ProtectedRoute>
  );
}

function PostContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const [formData, setFormData] = useState({
    locationName: '',
    city: '',
    state: '',
    dateSeen: '',
    timeSeen: '',
    description: '',
  });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (charCount < 20) return;

    setLoading(true);

    try {
      const { error } = await supabase.from('posts').insert({
        user_id: user?.id,
        location_name: formData.locationName,
        city: formData.city,
        state: formData.state,
        date_seen: formData.dateSeen,
        time_seen: formData.timeSeen,
        description: formData.description,
        is_anonymous: isAnonymous,
        views_count: 0,
        likes_count: 0,
        status: 'active',
      });

      if (error) throw error;
      router.push('/home');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-wf-gray rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Post a Missed Connection</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Where did you see them?</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search location"
              className="wf-input pl-10"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              required
            />
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-sm mb-2">City</label>
            <input
              type="text"
              placeholder="City"
              className="wf-input"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">State</label>
            <StateSelector
              value={formData.state}
              onChange={(state) => setFormData({ ...formData, state })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-400 text-sm mb-2">When did you see them?</label>
            <div className="relative">
              <input
                type="date"
                className="wf-input pl-10"
                value={formData.dateSeen}
                onChange={(e) => setFormData({ ...formData, dateSeen: e.target.value })}
                required
              />
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Time</label>
            <div className="relative">
              <input
                type="time"
                className="wf-input pl-10"
                value={formData.timeSeen}
                onChange={(e) => setFormData({ ...formData, timeSeen: e.target.value })}
                required
              />
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Your story</label>
          <textarea
            placeholder="Describe the moment, what they were wearing, what stood out. The more details, the better."
            className="wf-input min-h-[150px] resize-none"
            value={formData.description}
            onChange={handleDescriptionChange}
            maxLength={500}
            required
          />
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${charCount < 20 ? 'text-red-400' : 'text-gray-500'}`}>
              Minimum 20 characters
            </span>
            <span className="text-xs text-gray-500">{charCount}/500</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAnonymous(!isAnonymous)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-colors ${
            isAnonymous 
              ? 'border-wf-gold bg-wf-gold/10 text-wf-gold' 
              : 'border-wf-gray-light text-gray-400 hover:border-wf-gold/50'
          }`}
        >
          {isAnonymous ? <EyeOff size={18} /> : <Eye size={18} />}
          <span>{isAnonymous ? 'Posting anonymously' : 'Post with my name'}</span>
        </button>

        <button 
          type="submit" 
          className="wf-btn-primary mt-6" 
          disabled={loading || charCount < 20}
        >
          {loading ? 'Posting...' : 'Post Connection'}
        </button>
      </form>
    </div>
  );
}
