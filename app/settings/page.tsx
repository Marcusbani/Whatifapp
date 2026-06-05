'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Lock, Mail, Bell, Shield, ChevronRight, Eye, EyeOff } from 'lucide-react';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'main' | 'password' | 'email' | 'notifications'>('main');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // Email change state
  const [newEmail, setNewEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingEmail, setChangingEmail] = useState(false);

  // Notification state (stored in localStorage for MVP)
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wf_notifications');
      return saved ? JSON.parse(saved) : { email_replies: true, email_likes: false, push_enabled: false };
    }
    return { email_replies: true, email_likes: false, push_enabled: false };
  });

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setChangingPassword(true);
    try {
      // Supabase requires current password for security
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
        setChangingPassword(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setActiveSection('main'), 1500);
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);

    if (!newEmail.includes('@')) {
      setEmailMessage({ type: 'error', text: 'Please enter a valid email' });
      return;
    }

    setChangingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;

      setEmailMessage({ type: 'success', text: 'Verification email sent to new address. Check your inbox.' });
      setNewEmail('');
      setTimeout(() => setActiveSection('main'), 2000);
    } catch (err: any) {
      setEmailMessage({ type: 'error', text: err.message || 'Failed to update email' });
    } finally {
      setChangingEmail(false);
    }
  };

  const toggleNotification = (key: string) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('wf_notifications', JSON.stringify(updated));
  };

  if (activeSection === 'password') {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveSection('main')} className="p-2 hover:bg-wf-gray rounded-lg">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <h1 className="font-serif text-xl text-wf-ivory">Change Password</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-sm mx-auto">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                required
              />
            </div>

            {passwordMessage && (
              <div className={`text-sm px-3 py-2 rounded-lg ${
                passwordMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full bg-wf-gold text-wf-black font-semibold py-3 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (activeSection === 'email') {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveSection('main')} className="p-2 hover:bg-wf-gray rounded-lg">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <h1 className="font-serif text-xl text-wf-ivory">Change Email</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-sm mx-auto">
          <div className="mb-4 p-3 bg-wf-gray-light rounded-lg">
            <p className="text-gray-400 text-sm">Current email</p>
            <p className="text-wf-ivory">{user?.email}</p>
          </div>

          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                required
              />
            </div>

            {emailMessage && (
              <div className={`text-sm px-3 py-2 rounded-lg ${
                emailMessage.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {emailMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={changingEmail}
              className="w-full bg-wf-gold text-wf-black font-semibold py-3 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50"
            >
              {changingEmail ? 'Sending...' : 'Update Email'}
            </button>
          </form>
        </div>

        <BottomNav />
      </div>
    );
  }

  if (activeSection === 'notifications') {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setActiveSection('main')} className="p-2 hover:bg-wf-gray rounded-lg">
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <h1 className="font-serif text-xl text-wf-ivory">Notifications</h1>
          </div>
        </header>

        <div className="px-4 py-6 max-w-sm mx-auto space-y-4">
          <div className="wf-card flex items-center justify-between">
            <div>
              <h3 className="text-wf-ivory font-medium">Reply Notifications</h3>
              <p className="text-gray-500 text-sm">Email when someone replies to your post</p>
            </div>
            <button
              onClick={() => toggleNotification('email_replies')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.email_replies ? 'bg-wf-gold' : 'bg-wf-gray'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                notifications.email_replies ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="wf-card flex items-center justify-between">
            <div>
              <h3 className="text-wf-ivory font-medium">Like Notifications</h3>
              <p className="text-gray-500 text-sm">Email when someone likes your post</p>
            </div>
            <button
              onClick={() => toggleNotification('email_likes')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.email_likes ? 'bg-wf-gold' : 'bg-wf-gray'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                notifications.email_likes ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="wf-card flex items-center justify-between">
            <div>
              <h3 className="text-wf-ivory font-medium">Push Notifications</h3>
              <p className="text-gray-500 text-sm">Browser push notifications</p>
            </div>
            <button
              onClick={() => toggleNotification('push_enabled')}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications.push_enabled ? 'bg-wf-gold' : 'bg-wf-gray'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                notifications.push_enabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Main settings menu
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Account Settings</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-2">
        <button
          onClick={() => setActiveSection('password')}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <Lock size={18} className="text-gray-400" />
          <div className="flex-1">
            <span className="text-wf-ivory">Change Password</span>
            <p className="text-gray-500 text-sm">Update your password</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>

        <button
          onClick={() => setActiveSection('email')}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <Mail size={18} className="text-gray-400" />
          <div className="flex-1">
            <span className="text-wf-ivory">Change Email</span>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>

        <button
          onClick={() => setActiveSection('notifications')}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <Bell size={18} className="text-gray-400" />
          <div className="flex-1">
            <span className="text-wf-ivory">Notifications</span>
            <p className="text-gray-500 text-sm">Manage email and push preferences</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>

        <div className="wf-card flex items-center gap-4 border-wf-gold/20 bg-wf-gold/5">
          <Shield size={18} className="text-wf-gold" />
          <div className="flex-1">
            <span className="text-wf-gold font-medium">Security Tip</span>
            <p className="text-gray-500 text-sm">Use a strong, unique password and enable verification.</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
