'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Mail } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Terms of Service</h1>
        </div>
      </header>

      <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <div className="text-center mb-8">
          <FileText size={48} className="text-wf-gold mx-auto mb-4" />
          <h2 className="font-serif text-2xl text-wf-ivory">Terms of Service</h2>
          <p className="text-gray-500 text-sm mt-2">Last updated: June 2026</p>
        </div>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">1. Acceptance of Terms</h3>
            <p>By accessing or using What If, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">2. User Conduct</h3>
            <p>You agree to use What If in compliance with our Community Guidelines. Prohibited activities include harassment, impersonation, spam, and sharing of explicit content.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">3. Account Termination</h3>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may also delete their accounts at any time through their profile settings.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">4. Limitation of Liability</h3>
            <p>What If is provided as-is. We are not responsible for the accuracy of user-generated content or for any interactions between users.</p>
          </section>

          <section>
            <h3 className="text-wf-ivory font-medium text-lg mb-2">5. Contact</h3>
            <p>For questions about these terms, contact us at:</p>
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
