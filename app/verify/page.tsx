'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Phone, Mail, Shield, ArrowRight, BadgeCheck, Lock } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneCode, setPhoneCode] = useState('');
  const [step, setStep] = useState<'options' | 'phone' | 'email'>('options');

  const handleEmailVerify = async () => {
    setLoading(true);
    await supabase.auth.resend({
      type: 'signup',
      email: user?.email || '',
    });
    setStep('email');
    setLoading(false);
  };

  const handlePhoneVerify = async () => {
    setStep('phone');
  };

  const handleGoogleVerify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleFacebookVerify = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleTikTokVerify = async () => {
    // TikTok OAuth would need custom setup
    alert('TikTok verification coming soon');
  };

  if (step === 'email') {
    return (
      <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center">
        <Mail size={48} className="text-wf-gold mb-6" />
        <h1 className="font-serif text-2xl text-wf-ivory mb-4">Check Your Email</h1>
        <p className="text-gray-400 text-center mb-8 max-w-sm">
          We've sent a verification link to your email. Click it to verify your account.
        </p>
        <button onClick={() => router.push('/home')} className="wf-btn-primary max-w-sm">
          Continue to App
        </button>
      </div>
    );
  }

  if (step === 'phone') {
    return (
      <div className="min-h-screen px-6 py-12">
        <h1 className="font-serif text-2xl text-wf-ivory mb-4">Verify Phone</h1>
        <p className="text-gray-400 mb-8">
          We'll send you a code to verify your number.
        </p>

        <div className="max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="wf-input text-center text-2xl tracking-[0.5em]"
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
          />
          <button 
            onClick={() => router.push('/home')} 
            className="wf-btn-primary"
            disabled={phoneCode.length < 6}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12">
      <h1 className="font-serif text-3xl text-wf-ivory mb-2">Verify Your Account</h1>
      <p className="text-gray-400 mb-8">Help us keep What If? safe and real.</p>

      <div className="max-w-sm space-y-3">
        <button
          onClick={handlePhoneVerify}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <div className="w-12 h-12 bg-wf-gray-light rounded-xl flex items-center justify-center">
            <Phone size={20} className="text-wf-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-wf-ivory font-medium">Verify with Phone</h3>
            <p className="text-gray-500 text-sm">We'll send you a code to verify your number.</p>
          </div>
          <ArrowRight size={18} className="text-gray-500" />
        </button>

        <button
          onClick={handleGoogleVerify}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <div className="w-12 h-12 bg-wf-gray-light rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-wf-ivory font-medium">Verify with Social</h3>
            <p className="text-gray-500 text-sm">Verify easily and securely using your social account.</p>
          </div>
          <ArrowRight size={18} className="text-gray-500" />
        </button>

        <button
          onClick={handleFacebookVerify}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <div className="w-12 h-12 bg-wf-gray-light rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-wf-ivory font-medium">Verify with Facebook</h3>
            <p className="text-gray-500 text-sm">Fast and secure</p>
          </div>
          <ArrowRight size={18} className="text-gray-500" />
        </button>

        <button
          onClick={handleTikTokVerify}
          className="wf-card w-full flex items-center gap-4 hover:border-wf-gold transition-colors text-left"
        >
          <div className="w-12 h-12 bg-wf-gray-light rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-wf-ivory font-medium">Verify with TikTok</h3>
            <p className="text-gray-500 text-sm">Fast and secure</p>
          </div>
          <ArrowRight size={18} className="text-gray-500" />
        </button>

        <div className="wf-card w-full flex items-center gap-4 border-wf-gold/30 bg-wf-gold/5">
          <div className="w-12 h-12 bg-wf-gold/10 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-wf-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-wf-gold font-medium">Verified Human Badge</h3>
            <p className="text-gray-500 text-sm">Verified members help keep What If? real, safe and trustworthy.</p>
          </div>
          <BadgeCheck size={20} className="text-blue-400" />
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-xs mt-4">
          <Lock size={12} />
          <span>Your verification is private and will never be posted.</span>
        </div>
      </div>
    </div>
  );
}
