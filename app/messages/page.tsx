'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNav from '@/components/BottomNav';
import { Send, ArrowLeft, Shield, Edit3, MoreHorizontal } from 'lucide-react';

export default function MessagesPage() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}

function MessagesContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const postId = searchParams.get('post');

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'primary' | 'replies' | 'stories'>('primary');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (postId && user) {
      startConversation(postId);
    }
  }, [postId, user]);

  const fetchConversations = async () => {
    const { data } = await supabase
      .from('replies')
      .select('*, post:posts(location_name), sender:users(first_name, last_initial), receiver:users(first_name, last_initial)')
      .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    if (data) {
      const grouped = data.reduce((acc: any, msg: any) => {
        const key = msg.post_id;
        if (!acc[key]) acc[key] = { post: msg.post, messages: [] };
        acc[key].messages.push(msg);
        return acc;
      }, {});
      setConversations(Object.values(grouped));
    }
    setLoading(false);
  };

  const startConversation = async (pid: string) => {
    const { data: post } = await supabase
      .from('posts')
      .select('*, user:users(id, first_name, last_initial)')
      .eq('id', pid)
      .single();

    if (post) {
      setActiveConversation({
        post_id: pid,
        receiver_id: post.user_id,
        post_title: post.location_name,
        receiver_name: `${post.user.first_name} ${post.user.last_initial}.`,
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    await supabase.from('replies').insert({
      post_id: activeConversation.post_id,
      sender_id: user?.id,
      receiver_id: activeConversation.receiver_id,
      message: newMessage.trim(),
    });

    setMessages([...messages, {
      sender_id: user?.id,
      message: newMessage,
      created_at: new Date().toISOString(),
    }]);
    setNewMessage('');
  };

  if (activeConversation) {
    return (
      <div className="min-h-screen pb-20 flex flex-col">
        <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
          <div className="px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => setActiveConversation(null)} 
              className="p-2 hover:bg-wf-gray rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-400" />
            </button>
            <div>
              <h2 className="text-wf-ivory font-medium text-sm">{activeConversation.receiver_name}</h2>
              <p className="text-gray-500 text-xs">{activeConversation.post_title}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          <div className="bg-wf-gold/5 border border-wf-gold/20 rounded-xl p-4 text-center">
            <Shield size={16} className="text-wf-gold mx-auto mb-2" />
            <p className="text-gray-400 text-xs">
              Messages are private. No contact info is shared unless you choose to.
            </p>
          </div>

          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender_id === user?.id 
                  ? 'bg-wf-gold text-wf-black' 
                  : 'bg-wf-gray-light text-wf-ivory'
              }`}>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="px-4 py-3 border-t border-wf-gray-light bg-wf-black">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 wf-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button 
              type="submit" 
              className="p-3 bg-wf-gold rounded-xl text-wf-black hover:bg-wf-gold-light transition-colors"
              disabled={!newMessage.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </form>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="font-serif text-xl text-wf-ivory">Messages</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-wf-gray rounded-lg transition-colors">
              <Edit3 size={18} className="text-gray-400" />
            </button>
            <button className="p-2 hover:bg-wf-gray rounded-lg transition-colors">
              <MoreHorizontal size={18} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['primary', 'replies', 'stories'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-wf-ivory text-wf-black' 
                  : 'bg-wf-gray-light text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="wf-card animate-pulse h-20"></div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-wf-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-500 mb-2">No messages yet</p>
            <p className="text-gray-600 text-sm">Reply to a connection to start chatting</p>
          </div>
        ) : (
          conversations.map((conv: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveConversation(conv)}
              className="wf-card w-full text-left mb-3 hover:border-wf-gold transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-wf-gray-light rounded-full flex items-center justify-center shrink-0">
                <span className="text-wf-ivory text-sm font-medium">
                  {conv.messages[0]?.sender?.first_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-wf-ivory font-medium text-sm">{conv.messages[0]?.sender?.first_name || 'User'}</h3>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">
                  {conv.messages[0]?.message}
                </p>
              </div>
              <span className="text-gray-600 text-xs shrink-0">2m</span>
            </button>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
