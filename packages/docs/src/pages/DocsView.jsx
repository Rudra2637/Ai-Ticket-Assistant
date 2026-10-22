import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Database, 
  Bot, 
  ShieldCheck, 
  Layers, 
  Search, 
  Github, 
  Copy, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';

const DOCS_DATA = {
  intro: {
    category: 'Getting Started',
    title: 'Introduction',
    content: `### What is Ticket Assistant?

Ticket Assistant is an **unopinionated, headless AI-powered customer support ticketing framework**. It enables developers to drop an automated issue triage, skill-based routing, and SLA prioritization loop directly into their existing application in under 30 seconds.

Unlike traditional SaaS helpdesks (Zendesk, Freshdesk, Intercom) which force you to:
1. Pay thousands of dollars per support seat
2. Mirror your entire user authentication database to a third-party service
3. Send sensitive customer data to external proprietary silos

**Ticket Assistant lives inside your own database and backend stack.**

---

### Core Highlights:
* **🤖 Autonomous AI Triage**: Evaluates tickets in real-time, generates summaries, estimates priority, and writes troubleshooting notes for human staff.
* **🎯 Skill-Based Agent Routing**: Automatically matches tickets to the staff member with the highest skill overlap.
* **🗄️ Pluggable Storage**: First-class support for **MongoDB Atlas** (zero-config auto collections) and **Supabase / PostgreSQL** (isolated \`ticketai_*\` tables).
* **🔐 Built-in Agent Auth**: Zero-dependency password salting & verification (\`verifyAgentCredentials\`) without native C++ compilation dependencies like bcrypt.
* **⚡ Universal Runtime**: Works natively in **Next.js App Router**, Express, Remix, and Serverless environments.`
  },

  installation: {
    category: 'Getting Started',
    title: 'Installation',
    content: `### Option 1: Interactive CLI Setup (Recommended)
The fastest way to install Ticket Assistant is with the interactive CLI wizard:

\`\`\`bash
npx @ticket-assistant/cli init
\`\`\`

The wizard will:
1. Detect whether you are running **Next.js (App Router)** or an **Express server**
2. Ask you to select your database (**MongoDB** or **Supabase**)
3. Ask you to choose your AI triage provider (**Groq**, **Google Gemini**, or **OpenAI**)
4. Install \`@ticket-assistant/core\` into your dependencies
5. Generate a pre-configured \`ticket.config.js\` and starter API route handlers

---

### Option 2: Direct npm Installation
If you already have an existing project and want to configure it manually:

\`\`\`bash
npm install @ticket-assistant/core
\`\`\`

*(Optional)* If you plan to use the built-in Express router adapter:
\`\`\`bash
npm install express cors
\`\`\``
  },

  quickstart: {
    category: 'Getting Started',
    title: 'CLI Quickstart',
    content: `### Scaffolding a Brand-New Support Application
You can also use the CLI to generate a complete, standalone support backend from scratch:

\`\`\`bash
npx @ticket-assistant/cli my-support-app
\`\`\`

Or skip the interactive prompts by passing flags:

\`\`\`bash
npx @ticket-assistant/cli my-support-app --template=express --storage=supabase --ai=groq
\`\`\`

---

### Available CLI Flags:
| Flag | Description | Values |
| :--- | :--- | :--- |
| \`init\` | Run in existing project mode | N/A |
| \`--template\` | Choose server framework | \`express\`, \`nextjs\` |
| \`--storage\` | Choose database engine | \`supabase\`, \`mongo\` |
| \`--ai\` | Choose AI completions provider | \`groq\`, \`openai\`, \`gemini\` |
| \`--yes\`, \`-y\` | Accept defaults non-interactively | N/A |`
  },

  configuration: {
    category: 'Getting Started',
    title: 'Configuration (`ticket.config.js`)',
    content: `### Configuration Schema
Create a \`ticket.config.js\` file in your project root:

\`\`\`javascript
import { defineConfig } from '@ticket-assistant/core';

export default defineConfig({
  storage: {
    provider: 'mongo', // or 'supabase'
    mongoUri: process.env.MONGODB_URI
  },
  ai: {
    provider: 'groq', // 'gemini', 'openai', or 'ollama'
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  },
  agents: [
    {
      email: 'alex@company.com',
      name: 'Alex Johnson',
      skills: ['billing', 'payments', 'refunds']
    },
    {
      email: 'sarah@company.com',
      name: 'Sarah Connor',
      skills: ['security', 'database', 'infrastructure']
    }
  ]
});
\`\`\``
  },

  mongodb: {
    category: 'Database Adapters',
    title: 'MongoDB (Mongoose)',
    content: `### Zero-Configuration Setup
When using MongoDB, Ticket Assistant requires **zero manual database migration**:
* The \`ticketai_tickets\` and \`ticketai_agents\` collections are created **automatically on the first write**.
* Indexes (such as unique \`email\` constraints for agents) are built automatically by Mongoose.

\`\`\`typescript
import { TicketAssistant } from '@ticket-assistant/core';

const assistant = new TicketAssistant({
  storage: 'mongo',
  mongoUri: process.env.MONGODB_URI
});

await assistant.connect();
\`\`\`

---

### Reusing Existing Connections
If your application already connected to Mongoose during startup, simply pass \`storage: 'mongo'\` without a URI, and Ticket Assistant will automatically reuse your active connection.`
  },

  supabase: {
    category: 'Database Adapters',
    title: 'PostgreSQL (Supabase)',
    content: `### PostgreSQL Table Setup
Ticket Assistant isolates all data using namespaced tables (\`ticketai_*\`), ensuring zero interference with your existing schema.

Run this SQL once in your **Supabase SQL Editor**:

\`\`\`sql
-- 1. Create Agents Table
CREATE TABLE IF NOT EXISTS ticketai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  skills TEXT[] DEFAULT '{}',
  password_hash TEXT,
  auth_provider_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Tickets Table
CREATE TABLE IF NOT EXISTS ticketai_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  helpful_notes TEXT DEFAULT '',
  related_skills TEXT[] DEFAULT '{}',
  assigned_to UUID REFERENCES ticketai_agents(id) ON DELETE SET NULL,
  created_by TEXT,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_ticketai_agents_email ON ticketai_agents(email);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_status ON ticketai_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_assigned_to ON ticketai_tickets(assigned_to);
\`\`\`

---

### Connection Configuration
\`\`\`javascript
const assistant = new TicketAssistant({
  storage: 'supabase',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key bypasses RLS
});
\`\`\``
  },

  groq: {
    category: 'AI Providers',
    title: 'Groq (Ultra-Fast Triage)',
    content: `### Ultra-Fast 200ms Triage with Groq
Groq provides blazing-fast LPU inference, allowing tickets to be triaged, summarized, and routed in under 200 milliseconds.

\`\`\`javascript
const assistant = new TicketAssistant({
  ai: {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile' // or 'llama-3.1-8b-instant'
  }
});
\`\`\``
  },

  gemini: {
    category: 'AI Providers',
    title: 'Google Gemini',
    content: `### Google Gemini Integration
Native integration using Google's modern Gemini Flash models:

\`\`\`javascript
const assistant = new TicketAssistant({
  ai: {
    provider: 'gemini',
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash' // or 'gemini-2.0-flash'
  }
});
\`\`\``
  },

  credentials: {
    category: 'Agent Authentication',
    title: 'Agent Credentials & Verification',
    content: `### Built-in Zero-Dependency Auth
Ticket Assistant provides built-in password salting, hashing, and verification using Node.js native \`crypto.scryptSync\` and \`crypto.timingSafeEqual\`.

#### 1. Creating an Agent with Password
\`\`\`typescript
const agent = await assistant.createAgent({
  email: 'agent@support.com',
  name: 'Alex Johnson',
  password: 'SuperSecretPassword123!',
  skills: ['billing', 'infrastructure']
});
// Password is salted & hashed automatically.
// Password hash is stripped from the returned object for safety.
\`\`\`

#### 2. Verifying Agent Password (Login Endpoint)
\`\`\`typescript
const verifiedAgent = await assistant.verifyAgentCredentials(
  'agent@support.com',
  'SuperSecretPassword123!'
);

if (!verifiedAgent) {
  throw new Error('Invalid email or password');
}

// Returns safe agent object with id, email, name, skills
\`\`\``
  },

  nextauth: {
    category: 'Agent Authentication',
    title: 'NextAuth / Auth.js Recipe',
    content: `### NextAuth Credentials Provider Recipe
Use \`verifyAgentCredentials\` inside your NextAuth configuration:

\`\`\`typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getTicketAssistant } from "@/lib/ticket";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Agent Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const assistant = getTicketAssistant();
        
        // 👉 Call the verification helper
        const agent = await assistant.verifyAgentCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!agent) return null; // Rejects invalid password
        return agent;            // Signs in agent securely
      }
    })
  ]
});
\`\`\``
  },

  nextjs: {
    category: 'Framework Guides',
    title: 'Next.js (App Router)',
    content: `### Complete Next.js App Router Integration

#### 1. Helper Singleton (\`src/lib/ticket.ts\`)
\`\`\`typescript
import { TicketAssistant } from '@ticket-assistant/core';

let assistantInstance: TicketAssistant | null = null;

export function getTicketAssistant(): TicketAssistant {
  if (!assistantInstance) {
    assistantInstance = new TicketAssistant({
      storage: 'supabase',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      ai: {
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-1.5-flash'
      }
    });
  }
  return assistantInstance;
}
\`\`\`

#### 2. Route Handler (\`src/app/api/tickets/route.ts\`)
\`\`\`typescript
import { NextResponse } from 'next/server';
import { getTicketAssistant } from '@/lib/ticket';

export async function GET() {
  const assistant = getTicketAssistant();
  const tickets = await assistant.getTickets();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const assistant = getTicketAssistant();
  const { title, description } = await req.json();

  const ticket = await assistant.createTicket({
    title,
    description
  });

  return NextResponse.json(ticket, { status: 201 });
}
\`\`\``
  },

  'api-core': {
    category: 'API Reference',
    title: 'TicketAssistant Class API',
    content: `### Public Methods Overview

| Method | Arguments | Returns | Description |
| :--- | :--- | :--- | :--- |
| \`createTicket(data)\` | \`{ title, description, createdBy }\` | \`Promise<Ticket>\` | Creates a ticket and triggers background AI triage |
| \`getTickets(filter)\` | \`{ status, assignedTo, createdBy }\` | \`Promise<Ticket[]>\` | Lists tickets matching filters |
| \`getTicket(id)\` | \`id: string\` | \`Promise<Ticket \| null>\` | Fetches a single ticket with AI triage results |
| \`updateTicket(id, updates)\` | \`id, updates: Partial<Ticket>\` | \`Promise<Ticket \| null>\` | Updates ticket status, notes, or assignment |
| \`createAgent(data)\` | \`{ email, name, password, skills }\` | \`Promise<Agent>\` | Creates an agent and auto-hashes plain password |
| \`verifyAgentCredentials(email, pass)\` | \`email, password\` | \`Promise<Agent \| null>\` | Constant-time password verification helper |
| \`getAgents()\` | None | \`Promise<Agent[]>\` | Lists all registered support agents |
| \`seedAgents()\` | None | \`Promise<Agent[]>\` | Idempotently inserts agents from config |`
  }
};

const SECTIONS = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { id: 'intro', label: 'Introduction' },
      { id: 'installation', label: 'Installation' },
      { id: 'quickstart', label: 'CLI Quickstart' },
      { id: 'configuration', label: 'Configuration' }
    ]
  },
  {
    title: 'Database Adapters',
    icon: Database,
    items: [
      { id: 'mongodb', label: 'MongoDB (Mongoose)' },
      { id: 'supabase', label: 'PostgreSQL (Supabase)' }
    ]
  },
  {
    title: 'AI Providers',
    icon: Bot,
    items: [
      { id: 'groq', label: 'Groq (Ultra-Fast)' },
      { id: 'gemini', label: 'Google Gemini' }
    ]
  },
  {
    title: 'Agent Authentication',
    icon: ShieldCheck,
    items: [
      { id: 'credentials', label: 'Credentials & Verification' },
      { id: 'nextauth', label: 'NextAuth / Auth.js Recipe' }
    ]
  },
  {
    title: 'Framework Guides',
    icon: Layers,
    items: [
      { id: 'nextjs', label: 'Next.js (App Router)' }
    ]
  },
  {
    title: 'API Reference',
    icon: Terminal,
    items: [
      { id: 'api-core', label: 'TicketAssistant Class' }
    ]
  }
];

export default function DocsView({ onBackToHome }) {
  const [activeId, setActiveId] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const activeDoc = DOCS_DATA[activeId] || DOCS_DATA.intro;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#fafafa] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090d]/90 backdrop-blur-md px-5 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-[#00c950] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Home</span>
          </button>
          <div className="h-4 w-px bg-white/15"></div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">Ticket Assistant Docs</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#00c950]/10 text-[#00c950] border border-[#00c950]/30">
              v1.0.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0e1017] border border-white/10 rounded-[4px] pl-8 pr-3 py-1.5 text-xs font-mono text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#00c950]"
            />
          </div>
          <a
            href="https://github.com/Rudra2637/Ai-Ticket-Assistant"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary !px-3 !py-1.5 !text-xs !normal-case flex items-center gap-1.5"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 py-8 flex gap-10">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 hidden md:block border-r border-dashed border-white/10 pr-6">
          <nav className="space-y-6">
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00c950] font-semibold mb-2">
                  <sec.icon className="h-3.5 w-3.5" />
                  <span>{sec.title}</span>
                </div>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveId(item.id)}
                        className={`w-full text-left text-xs font-mono px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer ${
                          activeId === item.id
                            ? 'bg-[#00c950]/15 text-[#00c950] font-semibold border-l-2 border-[#00c950]'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content Section */}
        <main className="flex-1 min-w-0 max-w-3xl">
          <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#00c950]">
            <span>{activeDoc.category}</span>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
            <span className="text-white">{activeDoc.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            {activeDoc.title}
          </h1>

          <div className="prose prose-invert prose-pre:bg-[#0a0c10] prose-pre:border prose-pre:border-white/10 text-neutral-300 font-sans leading-relaxed text-sm space-y-4">
            {activeDoc.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-white mt-8 mb-3">
                    {block.replace('### ', '')}
                  </h3>
                );
              }
              if (block.startsWith('```')) {
                const lines = block.split('\n');
                const rawCode = lines.slice(1, -1).join('\n');
                return (
                  <div key={idx} className="relative rounded-lg border border-white/10 bg-[#0e1017] p-4 my-4 font-mono text-xs overflow-x-auto text-neutral-200">
                    <pre><code>{rawCode}</code></pre>
                  </div>
                );
              }
              return (
                <p key={idx} className="leading-relaxed text-neutral-300">
                  {block}
                </p>
              );
            })}
          </div>

          {/* Quick copy install snippet at the bottom of every guide */}
          <div className="mt-12 p-5 rounded-lg border border-white/10 bg-[#0e1017]/60 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-[#00c950] font-semibold uppercase tracking-wider mb-1">
                Quickstart via CLI Setup Wizard
              </p>
              <code className="font-mono text-xs text-white">npx @ticket-assistant/cli init</code>
            </div>
            <button
              onClick={() => handleCopy('npx @ticket-assistant/cli init')}
              className="btn-secondary !px-3 !py-1.5 !text-xs !normal-case"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-[#00c950]" /> : <Copy className="h-3.5 w-3.5 text-neutral-400" />}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
