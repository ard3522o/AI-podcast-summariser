# AI Podcast SaaS

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Convex](https://img.shields.io/badge/Convex-Database-orange)
![Clerk](https://img.shields.io/badge/Clerk-Auth-blue)
![Inngest](https://img.shields.io/badge/Inngest-Workflows-purple)
![AssemblyAI](https://img.shields.io/badge/AssemblyAI-Transcription-green)
![GrokAI](https://img.shields.io/badge/Groq-GPT-teal)

## Stop Spending Hours on Extracting Information from Podcasts - Let AI Do It!

Upload your podcast once. Get platform-optimized content for 6 social networks automatically.

### 📌 Who This Is For

**Podcast creators drowning in post-production work**

You've spent hours recording, editing, and producing your podcast. Now you need to:
- Write social media posts for 6 different platforms
- Create catchy titles and descriptions
- Generate timestamps for YouTube
- Find the best moments for clips
- Write captions and hashtags

**This app does all of that in seconds.**

### 🎯 Key Differentiator

**End-to-end AI workflow from upload to multi-platform content**

Not just transcription. Not just summaries. A complete content distribution system powered by AI that understands your podcast and creates tailored content for every platform.

### ⚡ Technical Highlight

**Parallel AI processing with Inngest (5x faster than sequential)**

Instead of waiting 5 minutes for AI tasks to run one-by-one, we run 6 AI generation jobs simultaneously. Your content is ready in ~90 seconds total.

---

## 🤔 What Is This App?

Think of it as **your AI newsroom for podcast content**.

Here's the simple explanation:

1. **You upload** one audio file (your podcast episode)
2. **AI analyzes** your content, understanding speakers, topics, and key moments
3. **You get** a complete content distribution package:
   - Summary with key insights
   - Social media posts tailored for Twitter, LinkedIn, Instagram, TikTok, YouTube, and Facebook
   - Title suggestions (short, long, SEO-optimized)
   - Platform-specific hashtags
   - YouTube chapter timestamps
   - Key moments for viral clips
   - Full transcript with speaker identification

**The workflow:** Record → Upload → AI Analyzes → Get Distribution Content

No manual writing. No copying and pasting between platforms. No guessing what hashtags work.

## ✨ Features

### For Podcast Creators

- **📝 AI Summary** - Comprehensive overview with bullets, key insights, and TLDR
- **📱 Social Posts** - Platform-optimized copy for 6 networks:
  - **Twitter** - 280 chars, punchy and engaging
  - **LinkedIn** - Professional tone, thought leadership
  - **Instagram** - Visual hooks with engagement questions
  - **TikTok** - Casual, trend-aware, Gen-Z friendly
  - **YouTube** - Description with CTAs and timestamps
  - **Facebook** - Community-focused conversation starters
- **🎯 Title Suggestions** - 4 different styles for every use case:
  - YouTube Short (catchy, under 60 chars)
  - YouTube Long (descriptive, SEO-friendly)
  - Podcast Titles (episode-focused)
  - SEO Keywords (discoverability)
- **#️⃣ Hashtags** - Platform-specific tags optimized for reach
- **⏱️ YouTube Timestamps** - Auto-generated chapter markers for better navigation
- **🎤 Key Moments** - AI identifies viral clip opportunities with timestamps
- **👥 Speaker Diarization** - "Who said what" with speaker labels and confidence scores

### Technical Features (The Smart Stuff)

- **⚡ Parallel AI Processing** - 6 AI jobs run simultaneously (60s total vs 300s sequential)
- **🔄 Real-time Updates** - See progress live with Convex subscriptions (no polling)
- **🛡️ Durable Workflows** - Inngest automatically retries failed steps (no lost work)
- **📊 Plan-based Feature Gating** - Features unlock based on subscription tier (Free/Pro/Ultra)
- **🎨 Dark Mode Support** - Beautiful UI that adapts to your preference
- **📦 Type-safe Throughout** - End-to-end TypeScript with Zod validation
- **🔐 Secure by Default** - Clerk authentication with row-level security

---

## 💰 Pricing Tiers

| Feature | FREE | PRO ($29/mo) | ULTRA ($69/mo) |
|---------|:----:|:------------:|:--------------:|
| **Projects** | 3 lifetime | 30/month | Unlimited |
| **File Size** | 10 MB | 200 MB | 3 GB |
| **Max Duration** | 10 min | 2 hours | Unlimited |
| **AI Summary** | ✓ | ✓ | ✓ |
| **Social Posts** | ✗ | ✓ | ✓ |
| **Titles & Hashtags** | ✗ | ✓ | ✓ |
| **YouTube Timestamps** | ✗ | ✗ | ✓ |
| **Key Moments** | ✗ | ✗ | ✓ |
| **Full Transcript** | ✗ | ✗ | ✓ |
| **Speaker Diarization** | ✗ | ✗ | ✓ |

---

## 🔧 How It Works

### User Flow

```mermaid
flowchart TD
    A[User Uploads Audio] --> B[File Saved to Vercel Blob]
    B --> C[Inngest Event Triggered]
    C --> D[Project Status: Processing]
    D --> E[AssemblyAI Transcription]
    E --> F[Parallel AI Content Generation]
    F --> G[Results Saved to Convex]
    G --> H[Project Status: Completed]
    H --> I[User Views Dashboard]
    I --> J[Real-time Updates via Convex]
```

**Performance Notes:**
- Transcription: ~30-60 seconds
- AI Content Generation (parallel): ~60 seconds
- **Total Processing Time: ~90-120 seconds**

---

### Parallel AI Processing Architecture

```mermaid
flowchart TD
    A[AssemblyAI Transcription Complete] --> B{Fan-out to Parallel Jobs}
    B --> C[Generate Summary]
    B --> D[Generate Social Posts]
    B --> E[Generate Titles]
    B --> F[Generate Hashtags]
    B --> G[Generate YouTube Timestamps]
    B --> H[Generate Key Moments]
    C --> I[Join All Results]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J[Save to Convex Database]
    J --> K[UI Updates in Real-time]
```

**Why This Matters:**
- **Sequential**: 6 jobs × 50s each = ~300 seconds (5 minutes)
- **Parallel**: All jobs run simultaneously = ~60 seconds
- **Result**: 5x faster processing

---

### Data Architecture

```mermaid
flowchart LR
    A[Client Upload] --> B[Next.js API Route]
    B --> C[Clerk Auth Check]
    C --> D[Vercel Blob Storage]
    D --> E[Inngest Event]
    E --> F[AssemblyAI Transcription]
    E --> G[OpenAI Content Generation]
    F --> H[Convex Database]
    G --> H
    H --> I[Real-time Subscription]
    I --> J[Client Dashboard Update]
```

---

## 🚀 Getting Started

### Installation Steps

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd ai-podcast-saas-inngest-coderabbit-clerk
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Then fill in all the required keys in `.env.local` (see Environment Variables section below).

4. **Start Convex development database**

```bash
pnpm convex dev
```

This will:
- Create a new Convex project (or connect to existing)
- Set up your database schema
- Generate TypeScript types
- Start watching for changes

5. **Start the development server** (in a new terminal)

```bash
pnpm dev
```

6. **Open your browser**

Navigate to `http://localhost:3000`

---

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Convex
CONVEX_DEPLOYMENT=dev:ai-podcast-saas-inngest-coderabbit-clerk
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_ISSUER_DOMAIN=your-domain.clerk.accounts.dev

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_...

# Assembly AI
ASSEMBLYAI_API_KEY=...

# Grok
Grok_API_KEY=sk-proj-...
```

### Service Configuration

#### 1. Clerk Setup (Authentication & Billing)

1. Go to [Clerk Dashboard](https://go.clerk.com/sonny)
2. Create a new application
3. Copy your publishable and secret keys to `.env.local`
4. **Enable Billing**:
   - Go to "Billing" → "Subscriptions"
   - Create three plans: `free`, `pro`, `ultra`
   - Set prices: Free ($0), Pro ($29/mo), Ultra ($69/mo)
5. **Configure Features** (match these identifiers):
   - `summary` (Free, Pro, Ultra)
   - `social_posts` (Pro, Ultra)
   - `titles` (Pro, Ultra)
   - `hashtags` (Pro, Ultra)
   - `youtube_timestamps` (Ultra only)
   - `key_moments` (Ultra only)
   - `speaker_diarization` (Ultra only)

#### 2. Convex Setup (Real-time Database)

1. Go to [Convex Dashboard](https://convex.dev)
2. Create a new project
3. Copy your deployment URL to `.env.local`
4. The schema will auto-deploy when you run `pnpm convex dev`

#### 3. Vercel Blob Setup (File Storage)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Create a new project (or use existing)
3. Go to "Storage" → "Create Database" → "Blob"
4. Copy the `BLOB_READ_WRITE_TOKEN` to `.env.local`

#### 4. Inngest Setup (Workflow Orchestration)

1. Go to [Inngest Dashboard](https://innge.st/sonny-2)
2. Create a new app
3. Copy your Event Key and Signing Key to `.env.local`
4. In development, Inngest will auto-discover your functions

#### 5. AssemblyAI Setup (Transcription)

1. Go to [AssemblyAI Dashboard](https://www.assemblyai.com/dashboard)
2. Create an account (free tier available)
3. Copy your API key to `.env.local`
4. **Pricing**: ~$0.00025/second (~$0.65 per hour of audio)

#### 6. OpenAI Setup (AI Content Generation)

1. Go to [Groq Platform](https://console.groq.com/home)
2. Create an API key
3. Copy your API key to `.env.local`
4. **Model Used**: llama-3.3-70b-versatile
---

## 📊 Database Schema Overview

### Main Model: `projects` Table

The entire application revolves around a single `projects` table in Convex. This denormalized structure allows for atomic updates and real-time reactivity.

**Key Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Clerk user ID (links project to user) |
| `inputUrl` | string | Vercel Blob URL for uploaded file |
| `status` | enum | `uploaded` → `processing` → `completed` or `failed` |
| `jobStatus` | object | Granular status for `transcription` and `contentGeneration` |
| `transcript` | object | Full transcript with segments, speakers, chapters |
| `summary` | object | AI-generated summary with bullets, insights, TLDR |
| `socialPosts` | object | Platform-specific posts (Twitter, LinkedIn, etc.) |
| `titles` | object | Title suggestions (YouTube, podcast, SEO) |
| `hashtags` | object | Platform-specific hashtag recommendations |
| `youtubeTimestamps` | array | Chapter markers for YouTube descriptions |
| `keyMoments` | array | Viral clip opportunities with timestamps |

**Design Decisions:**

- **Denormalized structure** - All data in one document for atomic updates
- **Optional fields** - Allow progressive population as Inngest jobs complete
- **Indexes** - Optimize queries by user, status, and creation date
- **Real-time reactivity** - Convex subscriptions trigger UI updates automatically

**Indexes:**

- `by_user` - List all projects for a user
- `by_status` - Filter by processing status
- `by_user_and_status` - User's active/completed projects
- `by_created_at` - Sort by newest first

---

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**

- Go to [Vercel Dashboard](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Vercel will auto-detect Next.js

3. **Add environment variables**

In Vercel dashboard → Settings → Environment Variables, add all variables from your `.env.local`

4. **Deploy**

Vercel will automatically deploy on every push to `main`

5. **Configure custom domain** (optional)

Settings → Domains → Add your domain

---

### CLI Deployment

```bash
npx vercel --prod
```
## 📚 Quick Reference

### Useful Commands

```bash
# Development
pnpm dev          # Start Next.js dev server + Convex watch
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome

# Convex
pnpm convex dev   # Start Convex development database
pnpm convex deploy # Deploy Convex to production

# Deployment
npx vercel        # Deploy to Vercel (preview)
npx vercel --prod # Deploy to production
```

---


### Important Concepts

**Plan-based Feature Gating**

Features are enabled based on the user's Clerk subscription tier:
- **Free**: Summary only (3 projects lifetime)
- **Pro**: + Social posts, titles, hashtags (30 projects/month)
- **Ultra**: + YouTube timestamps, key moments, full transcript (unlimited)

**Parallel AI Processing**

Instead of running AI generation tasks sequentially (slow), Inngest runs 6 jobs in parallel using `Promise.allSettled`. This reduces processing time from ~5 minutes to ~60 seconds.

**Real-time Updates**

Convex subscriptions (`useQuery`) automatically re-render components when database data changes. No polling, no manual refetching. As Inngest updates the project status, the UI updates instantly.

**Durable Execution**

Inngest provides automatic retry logic. If OpenAI times out or AssemblyAI fails, the step retries with exponential backoff. Your users never lose work.
