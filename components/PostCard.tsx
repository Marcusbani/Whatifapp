'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Heart, MessageCircle, MapPin, Clock, Trash2, X, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onReply?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onReply, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const displayName = post.is_anonymous 
    ? 'Anonymous' 
    : `${post.user?.first_name || 'User'} ${post.user?.last_initial || ''}.`;

  const isOwner = user?.id === post.user_id;

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id)
      .eq('user_id', user?.id);

    setDeleting(false);
    setShowDeleteConfirm(false);

    if (!error && onDelete) {
      onDelete(post.id);
    }
  };

  return (
    <div className="wf-card mb-4 relative">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg text-wf-ivory">{post.location_name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin size={14} />
            <span>{post.city}, {post.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock size={12} />
            <span>{post.date_seen}</span>
          </div>
          {isOwner && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1 hover:bg-red-500/10 rounded transition-colors"
              title="Delete post"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          )}
        </div>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
        "{post.description}"
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-wf-gray-light">
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <Heart size={14} /> {post.likes_count || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {post.views_count || 0}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{displayName}</span>
          {onReply && (
            <button 
              onClick={() => onReply(post.id)}
              className="flex items-center gap-1 text-wf-gold text-xs hover:text-wf-gold-light transition-colors"
            >
              <MessageCircle size={14} />
              Reply
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowDeleteConfirm(false)} 
          />
          <div className="relative bg-wf-black border border-wf-gray-light rounded-2xl w-full max-w-sm p-6">
            <div className="text-center mb-4">
              <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
              <h3 className="text-wf-ivory font-medium text-lg">Delete this post?</h3>
              <p className="text-gray-400 text-sm mt-1">
                This will permanently remove your missed connection post. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-wf-gray text-gray-400 hover:text-wf-ivory hover:border-wf-gold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
