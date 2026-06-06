import Link from 'next/link';
import Image from 'next/image';
import { Shield, MapPin, Users, Lock, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
          <Image 
            src="/WIF LOGO.png" 
            alt="What If? Logo" 
            width={96} 
            height={96} 
            className="w-full h-full object-cover"
            priority
          />
        </div>
      </div>

      {/* Brand */}
      <h1 className="font-serif text-4xl md:text-5xl text-wf-ivory mb-2 tracking-wide">WHAT IF?</h1>
      <p className="text-gray-400 text-lg mb-12 font-light">The connection you almost made.</p>

      {/* CTAs */}
      <div className="w-full max-w-sm space-y-3 mb-12">
        <Link href="/auth/signup" className="wf-btn-primary block text-center">
          Create Account
        </Link>
        <Link href="/auth/login" className="wf-btn-secondary block text-center">
          Log In
        </Link>
      </div>

      {/* Trust Points */}
      <div className="w-full max-w-sm space-y-4">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Users size={18} className="text-wf-gold shrink-0" />
          <span>Real people</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Shield size={18} className="text-wf-gold shrink-0" />
          <span>Verified accounts</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <MapPin size={18} className="text-wf-gold shrink-0" />
          <span>All 50 states</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <BookOpen size={18} className="text-wf-gold shrink-0" />
          <span>Real stories</span>
        </div>
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <Lock size={18} className="text-wf-gold shrink-0" />
          <span>Safe & private</span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-600 text-xs text-center">
        Not a dating app. A community for missed connections.
      </p>
    </div>
  );
}
