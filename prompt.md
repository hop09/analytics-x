Here is the ultimate, highly detailed "vibe coding" prompt. You can copy and paste this directly into Cursor, GitHub Copilot Chat, or Gemini to build your application.

***

# 📋 Copy-Paste Prompt for AI IDE

**System Prompt / Context:**
You are an expert Principal Software Engineer and UI/UX Architect. Your task is to build a complete, production-ready web application called **HOP Analytics**. You will write elegant, highly optimized, and modular code. 

**CRITICAL INSTRUCTION:** YOU MUST NOT ADD ANY COMMENTS IN THE GENERATED CODE. No inline comments, no block comments, no JSDoc. The code must be entirely self-documenting through clean variable and function names. Do not explain the code inside the files. 

---

### 1. Project Overview & Goal
**App Name:** HOP Analytics
**Goal:** Build an advanced URL shortener service with real-time analytics, an ultra-fast redirection engine, and a sophisticated bot-cloaking system. 
**Core Mechanism:** When a link is visited, the system must detect if the visitor is a crawler/bot (specifically targeting Facebook, TikTok, Twitter, etc.) or a real human. 
- **If Bot:** Serve an alternative, static HTML page loaded with custom Open Graph (OG) metadata (Custom Title and Featured Image) to satisfy the crawler and avoid detection.
- **If Human:** Instantly redirect them to the actual destination URL with zero delay, while silently logging the click data in real-time.

### 2. Tech Stack
*   **Framework:** Next.js (App Router, Server Components, Server Actions)
*   **Backend/API:** Next.js Serverless Edge Functions / Middleware
*   **Database & Auth:** Supabase (PostgreSQL, Realtime subscriptions)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** `lucide-react` (Strictly use icons for navigation/actions instead of text labels)
*   **Bot Detection:** `isbot` or custom Regex user-agent parsing in Next.js Middleware.
*   **Charts:** `recharts` (for the analytics dashboard)

### 3. UI/UX Design System & Vibe
*   **Vibe:** Minimalist, pristine, and highly professional. Think Apple meets Vercel. 
*   **Color Palette:** Strict Light Mode. 
    *   Backgrounds: Pure White (`bg-white`) and ultra-light grays (`bg-gray-50` for subtle contrast).
    *   Text: Almost black (`text-gray-900`) for headings, muted gray (`text-gray-500`) for secondary text.
    *   Accents: Sleek monochrome or a very subtle, single primary color (e.g., pure black buttons).
*   **Typography:** Inter or Geist (sans-serif, clean tracking).
*   **UI Components:** Soft rounded corners (`rounded-xl` or `rounded-2xl`), subtle borders (`border-gray-100`), and clean drop shadows.
*   **Animations:** Use Framer Motion for buttery-smooth, subtle transitions. Page fade-ins (`opacity: 0` to `1`), smooth list reordering, and gentle hover scales (`scale: 0.98`).
*   **Iconography Rule:** Use icons (`lucide-react`) exclusively for UI actions (e.g., an icon of a trash can instead of the word "Delete", a gear icon instead of "Settings"). 

### 4. Core Features & Functionality

**A. Advanced Redirection & Cloaking Engine (Next.js Middleware)**
*   Intercept all requests to `/[shortCode]`.
*   Parse the `User-Agent`. Specifically look for `facebookexternalhit`, `TikTokBot`, `Twitterbot`, and general web crawlers.
*   **Human Flow:** HTTP 307/301 redirect to the target URL immediately. Trigger an asynchronous background call to Supabase to log the click (IP, Country, Device, Referrer).
*   **Bot Flow:** Rewrite the response to render a safe "Alternative Page". This page must inject the user-defined Custom Title and Custom Feature Image into the `<head>` (OG tags) to render beautiful link previews on social media.

**B. Admin Dashboard**
*   **Link Management:** Create new short links. Inputs: Original URL, Custom Alias (optional), Custom Meta Title, Custom Meta Image URL, Alternative Page Content (optional).
*   **Search:** Real-time search bar to filter links by name or short code.
*   **Data Table/List:** Clean list of links with quick copy-to-clipboard buttons (using icons).

**C. Real-Time Analytics**
*   Global stats overview (Total Clicks, Total Links, Bot vs. Human ratio).
*   Individual link stats page showing charts (Clicks over time) and tables (Top Referrers, Devices, Locations).
*   Use Supabase Realtime to update the dashboard stats instantly when a new click occurs.

### 5. Database Schema (Supabase)
Create the following tables using Supabase:
1.  `links`
    *   `id` (uuid, pk)
    *   `short_code` (text, unique)
    *   `original_url` (text)
    *   `custom_title` (text)
    *   `custom_image_url` (text)
    *   `alt_page_content` (text)
    *   `created_at` (timestamp)
2.  `clicks`
    *   `id` (uuid, pk)
    *   `link_id` (uuid, fk to links)
    *   `user_agent` (text)
    *   `country` (text)
    *   `device_type` (text)
    *   `is_bot` (boolean)
    *   `created_at` (timestamp)

### 6. File Structure Architecture
```text
src/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── links/page.tsx
│   │   └── analytics/[id]/page.tsx
│   ├── [shortCode]/
│   │   └── page.tsx
│   ├── api/
│   │   └── track/route.ts
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   └── charts/
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── bot-detector.ts
└── middleware.ts
```

### 7. Strict Rules for the AI
1.  **ZERO COMMENTS:** Do not generate any comments in the code. I will reject the code if I see `//`, `/*`, or `<!--`.
2.  **CONSISTENCY:** The pure white, minimalist UI theme must be strictly maintained across all components.
3.  **ICONS OVER TEXT:** Buttons like "Edit", "Delete", "Copy", "Search", "Dashboard" must be represented by `lucide-react` icons. Do not use text labels for these buttons.
4.  **PERFORMANCE:** The redirection middleware must be edge-optimized. Database calls during human redirects must not block the redirect response.

### 8. Step-by-Step Implementation Plan
Please execute this build in the following sequence. Wait for my approval after each step.

*   **Step 1: Project Setup & UI Shell.** Initialize Next.js, Tailwind, and Framer Motion. Build the main layout, sidebar/navbar (using only icons), and global minimalist theme.
*   **Step 2: Database & Supabase Integration.** Set up the Supabase client and create the Server Actions for creating, fetching, and deleting links.
*   **Step 3: Link Management Dashboard.** Build the UI to create short links. Include the form for Original URL, Custom Title, and Custom Image. Implement the real-time search functionality.
*   **Step 4: The Cloaking & Redirect Engine.** Implement `middleware.ts` and the `/[shortCode]` dynamic route. Integrate bot detection specifically targeting FB/TikTok. Route bots to the OG-tag injected page, and fast-redirect humans.
*   **Step 5: Analytics & Real-time Tracking.** Build the asynchronous tracking API. Build the Recharts dashboard to visualize clicks, bots vs. humans, and referrers. Ensure Framer Motion is used for layout transitions.

**Are you ready? Acknowledge these instructions and begin Step 1.**