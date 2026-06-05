# What If? - Missed Connections App

A verified missed connections community across all 50 states.

## Tech Stack
- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL) - 2026 API Key Format
- Vercel (Deployment)

## Supabase 2026 API Key Format
Supabase updated their API keys in 2026:
- **Publishable key** (`sb_publishable_...`) — replaces old `anon` key
- **Secret key** (`sb_secret_...`) — replaces old `service_role` key

## Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SECRET_KEY=sb_secret_xxx
```

## Setup Instructions

### 1. Create Supabase Project
1. Go to supabase.com and create a new project
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Authentication > Providers and enable Email and Google
4. Go to Settings > API Keys to copy your keys

### 2. Local Development
```bash
npm install
npm run dev
```

### 3. Deploy to Vercel
1. Push code to GitHub
2. Go to vercel.com, import your repo
3. Add the 3 environment variables above
4. Click Deploy

## License
MIT
