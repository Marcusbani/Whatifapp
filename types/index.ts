export interface User {
  id: string;
  first_name: string;
  last_initial: string;
  email: string;
  phone?: string;
  city: string;
  state: string;
  profile_photo_url?: string;
  bio?: string;
  email_verified: boolean;
  phone_verified: boolean;
  social_verified: boolean;
  verification_badge: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  location_name: string;
  city: string;
  state: string;
  date_seen: string;
  time_seen: string;
  description: string;
  is_anonymous: boolean;
  views_count: number;
  likes_count: number;
  status: 'active' | 'hidden' | 'removed';
  created_at: string;
  user?: User;
}

export interface Reply {
  id: string;
  post_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender?: User;
}

export interface Report {
  id: string;
  post_id: string;
  reported_by: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface Block {
  id: string;
  blocker_user_id: string;
  blocked_user_id: string;
  created_at: string;
}

export interface SuccessStory {
  id: string;
  user_id: string;
  title: string;
  story: string;
  city: string;
  state: string;
  approved: boolean;
  created_at: string;
  user?: User;
}
