'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Mail } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Privacy Policy</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="text-center mb-8">
          <Shield size={48} className="text-wf-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-wf-ivory">Privacy Policy</h2>
          <p className="text-gray-500 text-sm mt-2">Last updated: June 2026</p>
        </div>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">1. Information We Collect</h3>
            <p>We collect information you provide directly to us, including your name, email address, profile information, and any content you post on What If.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">2. How We Use Your Information</h3>
            <p>We use your information to operate and improve our services, verify your identity, communicate with you, and ensure the safety of our community.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">3. Profile Visibility</h3>
            <p>You control your profile visibility through your Privacy settings. When set to Hidden, only your initials are shown to other users.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">4. Data Security</h3>
            <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">5. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <a href="mailto:support@whatifcity.com" className="inline-flex items-center gap-2 text-wf-gold mt-2 hover:text-wf-gold-light transition-colors">
              <Mail size={14} />
              support@whatifcity.com
            </a>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
