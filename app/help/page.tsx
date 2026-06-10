'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, MessageSquare, Bug, FileText, ChevronDown, ChevronUp, Mail, X, Send, Smartphone } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

const faqs = [
  {
    question: 'How do I get verified?',
    answer: 'Go to your Profile → Verification Badge. You can verify via email confirmation and connecting a Google or Facebook account. Phone verification coming soon.',
  },
  {
    question: 'Who can see my posts?',
    answer: 'Your posts are public and visible to all users. Use Profile Visibility settings to hide your full details.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to Profile → Delete Account. This permanently removes your profile, posts, replies, and all data. This action cannot be undone.',
  },
  {
    question: 'What is What If?',
    answer: 'What If? is a verified missed connections community across all 50 states. We help you reconnect with people you almost met.',
  },
  {
    question: 'How do I report someone?',
    answer: 'Tap the flag icon on any post or reply to submit a report. Our moderation team reviews all reports within 24 hours.',
  },
  {
    question: 'Is phone verification available?',
    answer: 'Phone Verification Coming Soon.',
  },
];

const guidelines = [
  {
    title: 'Be Respectful',
    text: 'Treat everyone with kindness. No harassment, hate speech, threats, or bullying of any kind.',
  },
  {
    title: 'Stay Safe',
    text: 'Never share personal information like your address, phone number, or financial details in public posts.',
  },
  {
    title: 'No Fake Profiles',
    text: 'Impersonation and catfishing are strictly prohibited. Use your real identity.',
  },
  {
    title: 'Keep It Clean',
    text: 'No nudity, sexually explicit content, or graphic violence. This is a community for genuine connections.',
  },
  {
    title: 'No Spam or Scams',
    text: 'Do not post promotional content, pyramid schemes, or attempt to defraud other users.',
  },
  {
    title: 'Report Violations',
    text: 'If you see something that breaks these rules, report it immediately. We review all reports within 24 hours.',
  },
];

export default function HelpPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ subject: '', description: '', email: '' });
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.subject.trim() || !reportForm.description.trim()) return;

    setReportSubmitting(true);

    const { error } = await supabase.from('bug_reports').insert({
      user_id: user?.id || null,
      subject: reportForm.subject.trim(),
      description: reportForm.description.trim(),
      email: reportForm.email.trim() || null,
      type: 'report',
      status: 'open',
    });

    setReportSubmitting(false);

    if (!error) {
      setReportSent(true);
      setReportForm({ subject: '', description: '', email: '' });
      setTimeout(() => {
        setReportSent(false);
        setShowReport(false);
      }, 2000);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.subject.trim() || !contactForm.message.trim()) return;

    setContactSubmitting(true);

    const { error } = await supabase.from('bug_reports').insert({
      user_id: user?.id || null,
      subject: contactForm.subject.trim(),
      description: contactForm.message.trim(),
      email: null,
      type: 'contact',
      status: 'open',
    });

    setContactSubmitting(false);

    if (!error) {
      setContactSent(true);
      setContactForm({ subject: '', message: '' });
      setTimeout(() => setContactSent(false), 3000);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/profile')} className="p-2 hover:bg-wf-gray rounded-lg">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <h1 className="font-serif text-xl text-wf-ivory">Help & Support</h1>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowGuidelines(true)}
            className="wf-card flex flex-col items-center gap-2 py-4 hover:border-wf-gold transition-colors"
          >
            <FileText size={24} className="text-wf-gold" />
            <span className="text-wf-ivory text-sm font-medium">Guidelines</span>
          </button>
          <button 
            onClick={() => setShowReport(true)}
            className="wf-card flex flex-col items-center gap-2 py-4 hover:border-wf-gold transition-colors"
          >
            <Bug size={24} className="text-wf-gold" />
            <span className="text-wf-ivory text-sm font-medium">Submit Report</span>
          </button>
        </div>

        {/* FAQ */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Frequently Asked</h2>
          {faqs.map((faq, i) => (
            <div key={i} className="wf-card">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-wf-ivory font-medium text-sm">{faq.question}</span>
                {openFaq === i ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {openFaq === i && (
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="space-y-2">
          <h2 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Contact Us</h2>
          <div className="wf-card">
            {contactSent ? (
              <div className="text-center py-4">
                <MessageSquare size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Message sent!</p>
                <p className="text-gray-500 text-sm">We will get back to you soon at support@whatifcity.com</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory focus:border-wf-gold focus:outline-none resize-none"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-wf-gold text-wf-black font-semibold py-2.5 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50"
                >
                  {contactSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Email fallback */}
        <div className="text-center space-y-2">
          <a
            href="mailto:support@whatifcity.com"
            className="inline-flex items-center gap-2 text-gray-400 text-sm hover:text-wf-gold transition-colors"
          >
            <Mail size={14} />
            support@whatifcity.com
          </a>
          <a
            href="mailto:reports@whatifcity.com"
            className="inline-flex items-center gap-2 text-gray-400 text-sm hover:text-wf-gold transition-colors"
          >
            <Mail size={14} />
            reports@whatifcity.com
          </a>
        </div>
      </div>

      {/* Community Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowGuidelines(false)} 
          />
          <div className="relative bg-wf-black border border-wf-gray-light rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light px-4 py-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-wf-ivory">Community Guidelines</h2>
              <button 
                onClick={() => setShowGuidelines(false)}
                className="p-1 hover:bg-wf-gray rounded-lg"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-4">
              {guidelines.map((g, i) => (
                <div key={i} className="space-y-1">
                  <h3 className="text-wf-gold font-medium text-sm">{g.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{g.text}</p>
                </div>
              ))}
              <div className="pt-2 border-t border-wf-gray-light">
                <p className="text-gray-500 text-xs text-center">
                  Violations may result in warnings, temporary suspension, or permanent account removal. Report issues to reports@whatifcity.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setShowReport(false)} 
          />
          <div className="relative bg-wf-black border border-wf-gray-light rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-wf-black/95 backdrop-blur-md border-b border-wf-gray-light px-4 py-3 flex items-center justify-between">
              <h2 className="font-serif text-lg text-wf-ivory">Submit a Report</h2>
              <button 
                onClick={() => setShowReport(false)}
                className="p-1 hover:bg-wf-gray rounded-lg"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="px-4 py-4">
              {reportSent ? (
                <div className="text-center py-8">
                  <MessageSquare size={40} className="text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-medium text-lg">Report submitted!</p>
                  <p className="text-gray-500 text-sm mt-1">We will review and respond via email if provided.</p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Subject *</label>
                    <input
                      type="text"
                      value={reportForm.subject}
                      onChange={e => setReportForm({ ...reportForm, subject: e.target.value })}
                      placeholder="What are you reporting?"
                      className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Description *</label>
                    <textarea
                      value={reportForm.description}
                      onChange={e => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Describe the issue or concern in detail..."
                      className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none resize-none"
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email (optional)</label>
                    <input
                      type="email"
                      value={reportForm.email}
                      onChange={e => setReportForm({ ...reportForm, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full bg-wf-gray-light border border-wf-gray rounded-lg px-3 py-2 text-wf-ivory placeholder-gray-600 focus:border-wf-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={reportSubmitting}
                    className="w-full bg-wf-gold text-wf-black font-semibold py-2.5 rounded-lg hover:bg-wf-gold/90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
