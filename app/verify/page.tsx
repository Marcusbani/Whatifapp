'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { Phone, Mail, Shield, ArrowRight, BadgeCheck, Lock, Clock } from 'lucide-react';

// Set to true when you configure SMS in Supabase
const SMS_CONFIGURED = false;

export default function VerifyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<'input' | 'code'>('input');
  const [phoneError, setPhoneError] = useState('');
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

  const handlePhoneVerify = () => {
    setStep('phone');
    setPhoneStep('input');
    setPhoneNumber('');
    setPhoneCode('');
    setPhoneError('');
  };

  const handleSendPhoneCode = async () => {
    setPhoneError('');

    // Validate: must be exactly 10 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      setPhoneError('Please enter a valid 10-digit U.S. phone number (e.g., 7025551234)');
      return;
    }

    setLoading(true);

    if (!SMS_CONFIGURED) {
      setLoading(false);
      return; // "Coming soon" UI handles this
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+1${digitsOnly}`,
      });

      if (error) throw error;

      setPhoneStep('code');
    } catch (err: any) {
      setPhoneError(err.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    setPhoneError('');

    if (phoneCode.length !== 6) {
      setPhoneError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const { error } = await supabase.auth.verifyOtp({
        phone: `+1${digitsOnly}`,
        token: phoneCode,
        type: 'sms',
      });

      if (error) throw error;

      // Success — redirect to profile
      router.push('/profile');
    } catch (err: any) {
      setPhoneError(err.message || 'Invalid code');
      setLoading(false);
    }
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
        <button
          onClick={() => setStep('options')}
          className="text-gray-400 text-sm mb-4 hover:text-wf-ivory"
        >
          ← Back
        </button>

        <h1 className="font-serif text-2xl text-wf-ivory mb-2">Verify Phone</h1>
        <p className="text-gray-400 mb-8">
          {SMS_CONFIGURED
            ? "We'll send you a code to verify your number."
            : "Phone verification is coming soon."}
        </p>

        {!SMS_CONFIGURED ? (
          <div className="max-w-sm">
            <div className="wf-card flex items-center gap-4 border-wf-gold/20 bg-wf-gold/5">
              <div className="w-12 h-12 bg-wf-gold/10 rounded-xl flex items-center justify-center">
                <Clock size={24} className="text-wf-gold" />
              </div>
              <div>
                <h3 className="text-wf-gold font-medium">Phone Verification</h3>
                <p className="text-gray-500 text-sm">Coming soon — check back later.</p>
              </div>
            </div>

            <button
              onClick={() => setStep('options')}
              className="wf-btn-primary w-full mt-6"
            >
              Back to Options
            </button>
          </div>
        ) : phoneStep === 'input' ? (
          <div className="max-w-sm space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="7025551234"
                maxLength={10}
                className="wf-input text-center text-lg tracking-wider"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              />
              <p className="text-gray-500 text-xs mt-1">Enter 10 digits, no spaces or dashes</p>
            </div>

            {phoneError && (
              <p className="text-red-400 text-sm">{phoneError}</p>
            )}

            <button
              onClick={handleSendPhoneCode}
              disabled={loading || phoneNumber.length !== 10}
              className="wf-btn-primary w-full"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </div>
        ) : (
          <div className="max-w-sm space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Code sent to {phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="wf-input text-center text-2xl tracking-[0.5em]"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {phoneError && (
              <p className="text-red-400 text-sm">{phoneError}</p>
            )}

            <button
              onClick={handleVerifyPhoneCode}
              disabled={loading || phoneCode.length !== 6}
              className="wf-btn-primary w-full"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <button
              onClick={() => setPhoneStep('input')}
              className="w-full text-gray-400 text-sm hover:text-wf-ivory"
            >
              Change phone number
            </button>
          </div>
        )}
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
            <p className="text-gray-500 text-sm">
              {SMS_CONFIGURED ? "We'll send you a code." : "Coming soon"}
            </p>
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
            <h3 className="text-wf-ivory font-medium">Verify with Google</h3>
            <p className="text-gray-500 text-sm">Fast and secure</p>
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
