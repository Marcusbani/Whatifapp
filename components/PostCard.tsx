import Link from 'next/link';
import { Eye, Heart, MessageCircle, MapPin, Clock } from 'lucide-react';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  onReply?: (postId: string) => void;
}

export default function PostCard({ post, onReply }: PostCardProps) {
  const displayName = post.is_anonymous 
    ? 'Anonymous' 
    : `${post.user?.first_name || 'User'} ${post.user?.last_initial || ''}.`;

  return (
    <div className="wf-card mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-serif text-lg text-wf-ivory">{post.location_name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin size={14} />
            <span>{post.city}, {post.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Clock size={12} />
          <span>{post.date_seen}</span>
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
    </div>
  );
}
