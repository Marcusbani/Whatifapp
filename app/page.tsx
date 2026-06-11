"use client";

import Link from "next/link";
import {
  ShieldCheck,
  EyeOff,
  MapPin,
  Ban,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  state: string;
  venue: string;
  time: string;
  title: string;
  excerpt: string;
  initials: string;
}

interface Story {
  quote: string;
  names: string;
  location: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const POSTS: Post[] = [
  {
    state: "Nevada",
    venue: "Allegiant Stadium",
    time: "2h ago",
    title: "You were wearing a vintage Raiders jersey in Section 114",
    excerpt:
      "We kept catching eyes during the third quarter. You laughed at something your friend said and I almost introduced myself but the crowd pushed us apart at the exit. I've been thinking about it since.",
    initials: "M.T",
  },
  {
    state: "New York",
    venue: "West 4th St Station",
    time: "5h ago",
    title: "You were reading Clarice Lispector on the uptown A train",
    excerpt:
      "Tuesday morning, around 8:45. You had a green tote bag and we smiled at the same moment when the lights flickered and came back on. You got off at 59th. I should've said something.",
    initials: "J.R",
  },
  {
    state: "Texas",
    venue: "Zilker Park, Austin",
    time: "Yesterday",
    title: "You rescued my kite from a tree and wouldn't let me pay you back",
    excerpt:
      "Sunday afternoon. You were with a golden retriever. You climbed up and untangled it like it was nothing, handed it back with a grin, and walked off before I even got your name.",
    initials: "A.L",
  },
];

const STORIES: Story[] = [
  {
    quote:
      "I posted it thinking nothing would come of it. Three days later she replied. We've been together eight months.",
    names: "Daniel & Priya",
    location: "met at a bookstore in Chicago",
  },
  {
    quote:
      "He described my scarf. I knew immediately it was me. We had coffee that same weekend.",
    names: "Camille & James",
    location: "coffee shop in Portland",
  },
];

const CITIES = [
  { label: "Las Vegas, NV", active: true },
  { label: "New York, NY", active: true },
  { label: "Los Angeles, CA", active: true },
  { label: "Chicago, IL", active: true },
  { label: "Austin, TX", active: true },
  { label: "Miami, FL", active: true },
  { label: "Seattle, WA", active: true },
  { label: "Denver, CO", active: true },
  { label: "Portland, OR", active: false },
  { label: "Nashville, TN", active: false },
  { label: "Boston, MA", active: false },
  { label: "Atlanta, GA", active: false },
];

const TRUST = [
  {
    icon: ShieldCheck,
    label: "Verified accounts only",
    desc: "Connect Google or Facebook to earn your verified badge. No bots, no fakes.",
  },
  {
    icon: EyeOff,
    label: "You control your visibility",
    desc: "Show only your initials. Hide your profile. Stay anonymous until you're ready.",
  },
  {
    icon: MapPin,
    label: "All 50 states",
    desc: "Browse by city or state. Your missed connection is out there looking too.",
  },
  {
    icon: Ban,
    label: "Safe & moderated",
    desc: "Block users, report posts, and community guidelines enforced by real admins.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="logo-block">
      <div className="logo-inner">
        <span className="logo-wf">WF</span>
        <span className="logo-dot" aria-hidden="true" />
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="post-card">
      <div className="post-meta">
        <span className="post-state">{post.state}</span>
        <span className="post-venue">{post.venue}</span>
        <span className="post-time">{post.time}</span>
      </div>
      <p className="post-title">{post.title}</p>
      <p className="post-excerpt">{post.excerpt}</p>
      <div className="post-footer">
        <div className="post-initials">{post.initials}</div>
        <span className="post-by">Posted by {post.initials}.</span>
        <span className="verified-badge">
          <CheckCircle2 size={11} />
          Verified
        </span>
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <div className="story-card">
      <p className="story-quote">&ldquo;{story.quote}&rdquo;</p>
      <p className="story-names">
        <strong>{story.names}</strong> — {story.location}{" "}
        <span className="heart" aria-hidden="true">
          ♥
        </span>
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0e0e0e;
          color: #f0ead8;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .serif { font-family: 'Playfair Display', serif; }

        /* ── Layout ── */
        .page { min-height: 100vh; }
        .section { padding: 3rem 1.5rem; max-width: 680px; margin: 0 auto; }
        .divider { border: none; border-top: 1px solid #2a2520; }

        /* ── Logo ── */
        .logo-block {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          background: #111111;
          border: 1px solid #2e2820;
          border-radius: 14px;
          margin-bottom: 1.5rem;
        }
        .logo-inner { position: relative; display: flex; align-items: center; justify-content: center; }
        .logo-wf {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -1px;
          color: #f0ead8;
          line-height: 1;
        }
        .logo-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #c9a84c;
          border-radius: 50%;
          top: -7px;
          right: 1px;
        }

        /* ── Hero ── */
        .hero { text-align: center; padding: 2.5rem 1.5rem 2rem; }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          font-weight: 400;
          letter-spacing: -1px;
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .hero-sub { font-size: 15px; color: #7a7265; margin-bottom: 2rem; letter-spacing: 0.02em; }

        /* ── Buttons ── */
        .btn-primary {
          display: block;
          width: 100%;
          max-width: 380px;
          margin: 0 auto 0.75rem;
          padding: 16px;
          background: #c9a84c;
          color: #1a1208;
          font-size: 15px;
          font-weight: 500;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.02em;
          text-align: center;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary {
          display: block;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 16px;
          background: #1e1c18;
          color: #f0ead8;
          font-size: 15px;
          font-weight: 400;
          border: 1px solid #2e2820;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-align: center;
          text-decoration: none;
          transition: border-color 0.15s;
        }
        .btn-secondary:hover { border-color: #4a4030; }

        /* ── Live label ── */
        .live-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #7a7265;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c9a84c;
          flex-shrink: 0;
        }

        /* ── Post cards ── */
        .post-card {
          background: #141210;
          border: 1px solid #242018;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 0.875rem;
          transition: border-color 0.2s;
        }
        .post-card:hover { border-color: #3a3020; }
        .post-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 0.625rem; flex-wrap: wrap; }
        .post-state {
          font-size: 11px;
          color: #c9a84c;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: #1e1a0e;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .post-venue { font-size: 12px; color: #5a5448; }
        .post-time { font-size: 12px; color: #3e3b34; margin-left: auto; }
        .post-title {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 400;
          color: #e8e0cc;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .post-excerpt { font-size: 13px; color: #6a6358; line-height: 1.6; }
        .post-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 0.875rem;
          padding-top: 0.75rem;
          border-top: 1px solid #1e1c18;
        }
        .post-initials {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #1e1a0e;
          border: 1px solid #2e2820;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #c9a84c;
          font-weight: 500;
          flex-shrink: 0;
        }
        .post-by { font-size: 12px; color: #4a4740; }
        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #4a7c5c;
          margin-left: auto;
        }

        .browse-btn {
          display: block;
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid #2a2520;
          border-radius: 8px;
          color: #5a5448;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-align: center;
          text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .browse-btn:hover { border-color: #4a4030; color: #7a7265; }

        /* ── Stories ── */
        .story-card {
          background: #141210;
          border: 1px solid #242018;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 0.875rem;
        }
        .story-quote {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-style: italic;
          color: #c8bfa8;
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .story-names { font-size: 13px; color: #7a7265; }
        .story-names strong { color: #c9a84c; font-weight: 500; }
        .heart { color: #8a3a4a; font-size: 16px; margin: 0 4px; }

        /* ── Trust rows ── */
        .trust-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 1rem 0;
          border-bottom: 1px solid #1a1814;
        }
        .trust-row:last-child { border-bottom: none; }
        .trust-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #1a1810;
          border: 1px solid #2a2418;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #c9a84c;
        }
        .trust-label { font-size: 14px; color: #d4cab0; font-weight: 500; margin-bottom: 2px; }
        .trust-desc { font-size: 13px; color: #5a5448; line-height: 1.5; }

        /* ── City grid ── */
        .state-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
        .state-pill {
          background: #141210;
          border: 1px solid #1e1c18;
          border-radius: 6px;
          padding: 8px 6px;
          text-align: center;
          font-size: 11px;
          color: #5a5448;
        }
        .state-pill.active { color: #c9a84c; border-color: #2a2418; }

        /* ── Section labels ── */
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a4740;
          margin-bottom: 0.5rem;
        }
        .section-heading {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: #d4cab0;
          margin-bottom: 1.5rem;
        }

        /* ── Footer CTA ── */
        .footer-cta { text-align: center; padding: 3rem 1.5rem; }
        .footer-tagline {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-style: italic;
          color: #c8bfa8;
          line-height: 1.4;
          margin-bottom: 1.5rem;
        }
        .footer-trust { margin-top: 1rem; font-size: 12px; color: #3e3b34; }
        .footer-links { margin-top: 2rem; display: flex; justify-content: center; gap: 4px; flex-wrap: wrap; }
        .footer-link { color: #3e3b34; font-size: 12px; padding: 0 8px; text-decoration: none; }
        .footer-link:hover { color: #5a5448; }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .hero-title { font-size: 40px; }
          .state-grid { grid-template-columns: repeat(2, 1fr); }
          .footer-tagline { font-size: 22px; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>

      <div className="page">

        {/* ── Hero ── */}
        <div className="hero">
          <Logo />
          <h1 className="hero-title serif">WHAT IF?</h1>
          <p className="hero-sub">The connection you almost made.</p>
          <Link href="/signup" className="btn-primary">
            Create Account — It&rsquo;s Free
          </Link>
          <Link href="/login" className="btn-secondary" style={{ marginTop: "0.75rem" }}>
            Log In
          </Link>
        </div>

        <hr className="divider" />

        {/* ── Recent Posts ── */}
        <div className="section">
          <div className="live-label">
            <span className="pulse" />
            Recent posts — happening now
          </div>
          {POSTS.map((post, i) => (
            <PostCard key={i} post={post} />
          ))}
          <Link href="/browse" className="browse-btn">
            Browse all posts ↗
          </Link>
        </div>

        <hr className="divider" />

        {/* ── Success Stories ── */}
        <div className="section">
          <p className="eyebrow">Success stories</p>
          <h2 className="section-heading serif">It actually worked.</h2>
          {STORIES.map((story, i) => (
            <StoryCard key={i} story={story} />
          ))}
        </div>

        <hr className="divider" />

        {/* ── Trust ── */}
        <div className="section">
          <p className="eyebrow">Why What If City</p>
          <h2 className="section-heading serif">Built for real people.</h2>
          {TRUST.map(({ icon: Icon, label, desc }, i) => (
            <div className="trust-row" key={i}>
              <div className="trust-icon">
                <Icon size={16} />
              </div>
              <div>
                <p className="trust-label">{label}</p>
                <p className="trust-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="divider" />

        {/* ── City Grid ── */}
        <div className="section">
          <p className="eyebrow">Across the country</p>
          <h2 className="section-heading serif">Your city is on here.</h2>
          <div className="state-grid">
            {CITIES.map(({ label, active }, i) => (
              <div key={i} className={`state-pill${active ? " active" : ""}`}>
                {label}
              </div>
            ))}
          </div>
        </div>

        <hr className="divider" />

        {/* ── Footer CTA ── */}
        <div className="footer-cta">
          <p className="footer-tagline serif">
            &ldquo;What if they&rsquo;re looking for you too?&rdquo;
          </p>
          <Link href="/signup" className="btn-primary">
            Create Your Free Account
          </Link>
          <p className="footer-trust">
            Free forever &nbsp;·&nbsp; Verified humans only &nbsp;·&nbsp; No ads
          </p>
          <div className="footer-links">
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <a href="mailto:support@whatifcity.com" className="footer-link">
              support@whatifcity.com
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
