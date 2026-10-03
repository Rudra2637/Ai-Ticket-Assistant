#  OpenDesk

> **The headless, embeddable, AI-powered support ticket triage and routing framework.**  
> *An open-source, developer-first alternative to Zendesk.*

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![npm version](https://img.shields.io/npm/v/@ticket-assistant/core.svg)](https://www.npmjs.com/package/@ticket-assistant/core)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

**OpenDesk** gives developers a drop-in customer support ticketing system with automatic AI issue triage, intelligent skill-based agent routing, and SLA prioritization. It embeds directly into your existing stack without forcing a separate authentication database or complex external queue infrastructure.

---

##  Highlights

*  **Autonomous AI Triage**: Evaluates inbound tickets in real time, generates issue summaries, estimates priority (`low` | `medium` | `high`), recommends troubleshooting notes, and extracts required skills.
*  **Skill-Based Agent Routing**: Automatically matches incoming tickets to the support agent with the highest skill overlap.
* 🔌 **Pluggable Storage**: First-class support for **MongoDB** (Mongoose) and **Supabase** (PostgreSQL) using namespaced `ticketai_*` tables.
*  **Universal Engine**: Works natively in **Next.js (App Router)**, **Express.js**, Remix, or pure serverless runtimes.
*  **Headless & Auth-Agnostic**: Zero forced `User` tables or password schemes. Adapts to your existing auth (Clerk, Supabase Auth, NextAuth / Auth.js, Firebase, or custom JWT).
*  **Zero Queue Lock-in**: Powered by a lightweight native async engine—no Redis or third-party queue services required for local or serverless deployment.
* 🤖 **Bring Your Own AI**: Native support for **Groq** (ultra-fast 200ms triage), **OpenAI**, **Gemini**, **DeepSeek**, or local **Ollama** models.

---

## 📦 Packages in this Monorepo

| Package | Version | Description |
| :--- | :--- | :--- |
| [`@ticket-assistant/core`](./packages/core) | `1.0.0` | Headless triage engine, storage proxies, and framework router adapters. |
| [`create-ticket-ai`](./packages/cli) | `1.0.0` | Interactive CLI to scaffold new projects or run `init` in existing codebases. |
| [`@ticket-assistant/dashboard`](./packages/dashboard) | `1.0.0` | React + Tailwind + Vite admin and agent workspace panel. |

---

##  Quickstart with CLI

The fastest way to get started is with the OpenDesk CLI:

### Option A: Initialize inside an existing codebase
```bash
cd my-existing-project
npx create-ticket-ai init
```
This inspects your project (detecting Next.js or Express), installs dependencies, creates `ticket.config.js`, and sets up starter route handlers.

### Option B: Scaffold a brand-new project
```bash
npx create-ticket-ai my-support-app
```
Follow the interactive prompts to choose your database (Supabase or MongoDB) and AI provider (Groq or OpenAI).

---

## 🛠️ Manual Installation & Usage

### 1. Install Core Package
```bash
npm install @ticket-assistant/core
```

---

### 2. Next.js (App Router) Integration

OpenDesk works natively with Next.js web-standard `Request` / `Response` without requiring Express:

```typescript
// lib/ticket.ts
import { TicketAssistant } from '@ticket-assistant/core';

export const assistant = new TicketAssistant({
  storage: 'supabase', // or 'mongo'
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ai: {
    apiKey: process.env.GEMINI_API_KEY, // or GROQ_API_KEY, OPENAI_API_KEY
    model: 'gemini-2.0-flash'          // or whatever model you choose
  }
});
```

```typescript
// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import { assistant } from '@/lib/ticket';
import { auth } from '@/auth'; // Your NextAuth / Clerk session

export async function GET() {
  const tickets = await assistant.getTickets();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description } = await req.json();
  const ticket = await assistant.createTicket({
    title,
    description,
    createdBy: session.user.id
  });

  return NextResponse.json(ticket, { status: 201 });
}
```

---

### 3. Express.js Integration

Attach OpenDesk routes and middleware directly to your Express app:

```javascript
import express from 'express';
import { TicketAssistant } from '@ticket-assistant/core';
import { requireUser, requireAgent } from './middleware/auth.js';

const app = express();
app.use(express.json());

const assistant = new TicketAssistant({
  storage: 'mongo',
  mongoUri: process.env.MONGODB_URI,
  auth: {
    middleware: requireUser,       // Runs on customer ticket creation & read
    agentMiddleware: requireAgent  // Runs on agent assignment & status updates
  }
});

await assistant.connect();

// Mounts GET /api/tickets, POST /api/tickets, GET /api/agents, etc.
app.use('/api', await assistant.getRouter());

app.listen(3000, () => {
  console.log(' OpenDesk server running on http://localhost:3000');
});
```

---

## 🗄️ Database Setup

OpenDesk prefixes all tables with `ticketai_*` so it never collides with your existing database schema.

### MongoDB
No manual migrations needed! Mongoose automatically creates:
* `ticketai_tickets`
* `ticketai_agents`

### Supabase (PostgreSQL)
Run the provided SQL migration in your Supabase SQL editor:

```sql
-- Agents Table
CREATE TABLE IF NOT EXISTS ticketai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets Table
CREATE TABLE IF NOT EXISTS ticketai_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  summary TEXT,
  helpful_notes TEXT,
  related_skills TEXT[] DEFAULT '{}',
  assigned_to UUID REFERENCES ticketai_agents(id) ON DELETE SET NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_status ON ticketai_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_assigned_to ON ticketai_tickets(assigned_to);
```

> **Note on RLS**: In production, use your Supabase `SUPABASE_SERVICE_ROLE_KEY` with OpenDesk backend operations to bypass row-level policies securely.

---

## ⚙️ Environment Variables

Create a `.env` file in your project:

```env
# Storage (MongoDB)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# OR Storage (Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-service-role-key

# AI Configuration (Gemini, Groq, OpenAI, DeepSeek, etc.)
# 1. Google Gemini:
GEMINI_API_KEY=AIzaSy...
AI_MODEL=gemini-2.0-flash

# OR 2. Groq:
# GROQ_API_KEY=gsk_...
# AI_MODEL=openai/gpt-oss-20b

# OR 3. OpenAI:
# OPENAI_API_KEY=sk-...
# AI_MODEL=gpt-4o-mini

# Optional SMTP for Notifications
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-user
SMTP_PASS=your-password
```

---

## 🖥️ Running the Monorepo Locally

```bash
# Install all dependencies across workspaces
npm install

# Start both backend server (port 3000) and web dashboard (port 5173)
npm run dev
```

Visit **`http://localhost:5173`** to access the live dashboard panel.

---

## 📄 License

ISC License &copy; 2026 OpenDesk Contributors.
