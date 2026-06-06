'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import {
  Settings, Shield, LogOut, ChevronRight, BadgeCheck, Edit3, Lock,
  HelpCircle, Trash2, X, AlertTriangle, Camera, User
} from 'lucide-react';

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

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_initial: '',
    city: '',
    state: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Avatar upload state
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (data) {
      setProfile(data);
      setEditForm({
        first_name: data.first_name || '',
        last_initial: data.last_initial || '',
        city: data.city || '',
        state: data.state || '',
        bio: data.bio || '',
      });
    }

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

  // AVATAR UPLOAD
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setSaveMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'Image must be under 5MB' });
      return;
    }

    setUploadingAvatar(true);
    setSaveMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchProfile();
      setSaveMessage({ type: 'success', text: 'Profile photo updated!' });
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to upload photo' });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaveMessage(null);

    const { error } = await supabase
      .from('users')
      .update({
        first_name: editForm.first_name.trim(),
        last_initial: editForm.last_initial.trim().slice(0, 1),
        city: editForm.city.trim(),
        state: editForm.state.trim(),
        bio: editForm.bio.trim(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save profile' });
    } else {
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
      await fetchProfile();
      setTimeout(() => setEditOpen(false), 800);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setDeleteMessage({ type: 'error', text: 'Please type DELETE to confirm' });
      return;
    }

    setDeleting(true);
    setDeleteMessage(null);

    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to delete account');
      }

      await signOut();
      router.push('/');
    } catch (err: any) {
      setDeleting(false);
      setDeleteMessage({ type: 'error', text: err.message || 'Account deletion failed' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // VERIFICATION CHECK
  const getVerificationStatus = () => {
    if (!user) return { isVerified: false, isEmailVerified: false, hasSocial: false };

    const isEmailVerified = !!user.email_confirmed_at;
    const providers = user.app_metadata?.providers || [];
    const currentProvider = user.app_metadata?.provider;

    const socialProviders = ['google', 'facebook'];
    const hasSocial =
      (currentProvider ? socialProviders.includes(currentProvider) : false) ||
      providers.some((p: string) => socialProviders.includes(p));

    return {
      isVerified: isEmailVerified && hasSocial,
      isEmailVerified,
      hasSocial,
    };
  };

  const verification = getVerificationStatus();

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
        {/* Profile Header with Avatar */}
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-wf-gold/30 overflow-hidden ${
                profile.avatar_url ? '' : 'bg-wf-gray-light'
              }`}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-3xl text-wf-ivory">
                  {profile.first_name?.charAt(0)}{profile.last_initial}
                </span>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 bg-wf-gold rounded-full shadow-lg hover:bg-wf-gold/90 transition-colors disabled:opacity-50"
            >
              {uploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-wf-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera size={14} className="text-wf-black" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <h2 className="font-serif text-2xl text-wf-ivory">
            {profile.first_name} {profile.last_initial}.
          </h2>
          <p className="text-gray-500 text-sm mt-1">{profile.city}, {profile.state}</p>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">{profile.bio || 'Entrepreneur. Coffee addict. Always open to new connections.'}</p>

          {verification.isVerified ? (
            <div className="flex items-center justify-center gap-1 mt-3">
              <BadgeCheck size={16} className="text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Verified Human</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1 mt-3">
              <User size={14} className="text-gray-500" />
              <span className="text-gray-500 text-xs">
                {!verification.isEmailVerified
                  ? 'Verify email to start'
                  : 'Connect Google or Facebook for badge'}
              </span>
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
          <button
            onClick={() => {
              setEditOpen(true);
              setSaveMessage(null);
            }}
            className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
          >
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
              <p className="text-gray-500 text-xs">
                {verification.isEmailVerified
                  ? (verification.hasSocial
                      ? 'Verified'
                      : 'Connect a social account')
                  : 'Confirm email to start verification'}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => router.push('/settings')}
            className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
          >
            <Settings size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Account Settings</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => router.push('/privacy')}
            className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
          >
            <Lock size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Privacy & Safety</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => router.push('/help')}
            className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
          >
            <HelpCircle size={18} className="text-gray-400" />
            <span className="text-wf-ivory flex-1">Help & Support</span>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button
            onClick={() => {
              setDeleteOpen(true);
              setDeleteConfirmText('');
              setDeleteMessage(null);
            }}
            className="wf-card w-full flex items-center gap-4 hover:border-red-500/50 transition-colors text-left border-red-500/20"
          >
            <Trash2 size={18} className="text-red-400" />
            <span className="text-red-400 flex-1">Delete Account</span>
            <ChevronRight size={16} className="text-red-400/50" />
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

      {/* EDIT PROFILE MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center">
          <div className="bg-wf-black w-full sm:w-[28rem] sm:rounded-2xl rounded-t-2xl border border-wf-gray-light p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl text-wf-ivory">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-1 hover:bg-wf-gray rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">First Name</label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                  maxLength={50}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Last Initial</label>
                <input
                  type="text"
                  value={editForm.last_initial}
                  onChange={e => setEditForm({ ...editForm, last_initial: e.target.value.slice(0, 1) })}
                  className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                  maxLength={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                    maxLength={100}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none resize-none"
                  rows={3}
                  maxLength={300}
                />
              </div>

              {saveMessage && (
                <div className={`text-sm px-3 py-2 rounded-lg ${
                  saveMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                }`}>
                  {saveMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-wf-gold text-wf-black font-semibold py-3 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT MODAL */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-wf-black w-full max-w-sm rounded-2xl border border-red-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h2 className="font-serif text-xl text-red-400">Delete Account</h2>
            </div>

            <p className="text-gray-400 text-sm mb-4">
              This action cannot be undone. This will permanently delete your account, profile, posts, replies, and messages.
            </p>

            <div className="mb-4">
              <label className="block text-gray-500 text-xs mb-1">
                Type <span className="text-red-400 font-mono">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                className="w-full bg-wf-gray-light border border-red-500/30 rounded-lg px-3 py-2 text-wf-ivory focus:border-red-500 focus:outline-none font-mono"
                placeholder="DELETE"
                autoComplete="off"
              />
            </div>

            {deleteMessage && (
              <div className={`text-sm px-3 py-2 rounded-lg mb-4 ${
                deleteMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {deleteMessage.text}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-wf-gray rounded-lg text-gray-400 hover:bg-wf-gray-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
              >
                {deleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
