'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Eye, EyeOff, UserX, AlertTriangle, X, MessageSquare, Bug, Clock, CheckCircle } from 'lucide-react';

interface BlockedUser {
  id: string;
  blocked_id: string;
  created_at: string;
  blocked_profile: {
    first_name: string;
    last_initial: string;
  } | null;
}

interface Report {
  id: string;
  subject: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
}

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <PrivacyContent />
    </ProtectedRoute>
  );
}

function PrivacyContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBlocked, setShowBlocked] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [savingVisibility, setSavingVisibility] = useState(false);
  
  // Report Center
  const [showReports, setShowReports] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBlockedUsers();
      fetchProfileVisibility();
    }
  }, [user]);

  const fetchProfileVisibility = async () => {
    const { data } = await supabase
      .from('users')
      .select('profile_visible')
      .eq('id', user?.id)
      .single();

    if (data) setProfileVisible(data.profile_visible ?? true);
  };

  const toggleProfileVisibility = async () => {
    if (!user) return;
    setSavingVisibility(true);

    const newValue = !profileVisible;
    const { error } = await supabase
      .from('users')
      .update({ profile_visible: newValue })
      .eq('id', user.id);

    if (!error) setProfileVisible(newValue);
    setSavingVisibility(false);
  };

  const fetchBlockedUsers = async () => {
    const { data } = await supabase
      .from('blocks')
      .select(`
        id,
        blocked_id,
        created_at,
        blocked_profile:users!blocks_blocked_id_fkey(first_name, last_initial)
      `)
      .eq('blocker_id', user?.id);

    const flattened: BlockedUser[] = (data || []).map((item: any) => ({
      id: item.id,
      blocked_id: item.blocked_id,
      created_at: item.created_at,
      blocked_profile: item.blocked_profile?.[0] || null,
    }));

    setBlockedUsers(flattened);
    setLoading(false);
  };

  const unblockUser = async (blockId: string) => {
    await supabase.from('blocks').delete().eq('id', blockId);
    await fetchBlockedUsers();
  };

  const fetchReports = async () => {
    if (!user) return;
    setReportsLoading(true);
    
    const { data } = await supabase
      .from('bug_reports')
      .select('id, subject, description, type, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setReports(data || []);
    setReportsLoading(false);
  };

  const openReportCenter = () => {
    setShowReports(true);
    fetchReports();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    if (status === 'resolved') return <CheckCircle size={14} className="text-green-400" />;
    return <Clock size={14} className="text-yellow-400" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'resolved') return 'Resolved';
    return 'Open';
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Privacy & Safety</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Privacy Settings */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Privacy</h2>

          {/* Profile Visibility Toggle */}
          <div className="wf-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              {profileVisible ? (
                <Eye size={18} className="text-wf-gold" />
              ) : (
                <EyeOff size={18} className="text-gray-500" />
              )}
              <div>
                <span className="text-wf-ivory">Profile Visibility</span>
                <p className="text-gray-500 text-xs">
                  {profileVisible ? 'Public — anyone can see your profile' : 'Hidden — only initials shown to others'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleProfileVisibility}
              disabled={savingVisibility}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                profileVisible ? 'bg-wf-gold' : 'bg-wf-gray'
              } ${savingVisibility ? 'opacity-50' : ''}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                profileVisible ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        {/* Safety Settings */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Safety</h2>

          <button
            onClick={() => setShowBlocked(!showBlocked)}
            className="wf-card w-full flex items-center justify-between hover:border-wf-gold transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <UserX size={18} className="text-gray-400" />
              <div>
                <span className="text-wf-ivory">Blocked Users</span>
                <p className="text-gray-500 text-xs">{blockedUsers.length} blocked</p>
              </div>
            </div>
            {showBlocked ? <EyeOff size={16} className="text-gray-500" /> : <Eye size={16} className="text-gray-500" />}
          </button>

          {showBlocked && (
            <div className="space-y-2">
              {loading ? (
                <p className="text-gray-500 text-sm text-center py-4">Loading...</p>
              ) : blockedUsers.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No blocked users</p>
              ) : (
                blockedUsers.map((block) => (
                  <div key={block.id} className="wf-card flex items-center justify-between">
                    <span className="text-wf-ivory">
                      {block.blocked_profile?.first_name || 'Unknown'} {block.blocked_profile?.last_initial || ''}.
                    </span>
                    <button
                      onClick={() => unblockUser(block.id)}
                      className="text-red-400 text-sm hover:text-red-300"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Report Center - now clickable */}
          <button
            onClick={openReportCenter}
            className="wf-card w-full flex items-center gap-3 border-wf-gold/20 bg-wf-gold/5 hover:border-wf-gold/40 transition-colors text-left"
          >
            <AlertTriangle size={18} className="text-wf-gold" />
            <div className="flex-1">
              <span className="text-wf-gold font-medium">Report Center</span>
              <p className="text-gray-500 text-xs">View and manage your reports</p>
            </div>
            <Eye size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Report Center Modal */}
      {showReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowReports(false)} 
          />
          <div className="relative bg-wf-black border border-wf-gray-light rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light px-4 py-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-wf-ivory">Your Reports</h2>
              <button 
                onClick={() => setShowReports(false)}
                className="p-1 hover:bg-wf-gray rounded-lg"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="px-4 py-4">
              {reportsLoading ? (
                <p className="text-gray-500 text-sm text-center py-8">Loading...</p>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No reports submitted yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div key={report.id} className="wf-card space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {report.type === 'bug' ? (
                            <Bug size={14} className="text-wf-gold" />
                          ) : (
                            <MessageSquare size={14} className="text-wf-gold" />
                          )}
                          <span className="text-wf-ivory text-sm font-medium">{report.subject}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          {getStatusIcon(report.status)}
                          <span className={report.status === 'resolved' ? 'text-green-400' : 'text-yellow-400'}>
                            {getStatusText(report.status)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{report.description}</p>
                      <p className="text-gray-600 text-xs">{formatDate(report.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
