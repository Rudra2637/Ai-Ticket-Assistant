import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Database, 
  Bot, 
  ShieldCheck, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  ArrowRight, 
  Star, 
  Code2, 
  Cpu, 
  Workflow, 
  CheckCircle2, 
  Zap,
  Globe,
  BookOpen
} from 'lucide-react';

export default function LandingPage({ onOpenDocs }) {
  const [copiedCmd, setCopiedCmd] = useState('');
  const [activeCodeTab, setActiveCodeTab] = useState('cli');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  const codeSnippets = {
    cli: `// 1. Run the interactive setup wizard anywhere
npx @ticket-assistant/cli init

// What it does automatically:
// ✔ Detects your framework (Next.js App Router or Express)
// ✔ Configures your database (MongoDB or Supabase)
// ✔ Selects your AI provider (Groq, Gemini, or OpenAI)
// ✔ Installs @ticket-assistant/core
// ✔ Generates ticket.config.js & starter route handlers`,

    nextjs: `// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import { TicketAssistant } from '@ticket-assistant/core';

const assistant = new TicketAssistant({
  storage: 'supabase', // or 'mongo'
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ai: { apiKey: process.env.GEMINI_API_KEY }
});

export async function POST(req: Request) {
  const { title, description } = await req.json();

  // Creates ticket and automatically triggers background AI triage
  const ticket = await assistant.createTicket({
    title,
    description,
    createdBy: 'user_123'
  });

  return NextResponse.json(ticket, { status: 201 });
}`,

    auth: `// app/api/agent/login/route.ts (or NextAuth authorize callback)
import { NextResponse } from 'next/server';
import { assistant } from '@/lib/ticket';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Verifies password against stored scrypt hash in constant time
  const agent = await assistant.verifyAgentCredentials(email, password);

  if (!agent) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Safe agent object returned (password hash stripped automatically)
  return NextResponse.json({ message: "Login successful", agent });
}`,

    config: `// ticket.config.js
import { defineConfig } from '@ticket-assistant/core';

export default defineConfig({
  storage: {
    provider: 'mongo', // or 'supabase'
    mongoUri: process.env.MONGODB_URI
  },
  ai: {
    provider: 'groq', // ultra-fast 200ms triage
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile'
  },
  agents: [
    {
      email: 'alex@company.com',
      name: 'Alex Johnson',
      skills: ['billing', 'payments', 'refunds']
    }
  ]
});`
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#fafafa] relative overflow-hidden bg-grid-pattern">
      {/* Top Ambient Glow Effect */}
      <div 
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20 blur-[120px] rounded-full"
        style={{ background: 'radial-gradient(circle, #00c950 0%, transparent 70%)' }}
      />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08090d]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-[4px] border border-[#00c950]/30 bg-[#00c950]/10 flex items-center justify-center text-[#00c950] font-mono font-bold text-sm">
              &lt;/&gt;
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Ticket Assistant</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#00c950]/10 text-[#00c950] border border-[#00c950]/30">
                v1.0.1
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#code" className="hover:text-white transition-colors">Code</a>
            <button onClick={onOpenDocs} className="hover:text-[#00c950] transition-colors cursor-pointer text-left">
              Docs
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Rudra2637/Ai-Ticket-Assistant" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary !px-3 !py-1.5 !text-xs !normal-case flex items-center gap-1.5"
            >
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="font-mono text-xs">Star</span>
            </a>
            <button 
              onClick={onOpenDocs}
              className="btn-primary !px-4 !py-1.5 !text-xs"
            >
              Read Docs
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24 pb-16 border-b border-dashed border-white/10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[#00c950]/30 bg-[#00c950]/10 mb-8">
            <span className="size-2 rounded-full bg-[#00c950] animate-pulse"></span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#00c950] font-semibold">
              01 / AUTONOMOUS AI SUPPORT FRAMEWORK
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-[68px] font-bold tracking-tight text-white leading-[110%] mb-6">
            The Support Ticketing Engine for <br className="hidden sm:inline" />
            <span className="text-[#00c950] relative inline-block">
              Builders Who Ship
              <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#00c950]/30 rounded"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-400 font-normal leading-relaxed mb-10 text-pretty">
            Drop-in autonomous AI issue triage, real-time priority estimation, intelligent skill-based agent routing, and zero-dependency credential authentication.
          </p>

          {/* Quick Terminal & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            {/* 1-Click Copy CLI Pill */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-[4.32px] border border-white/15 bg-[#0e1017] shadow-inner font-mono text-xs text-neutral-300 w-full sm:w-auto justify-between">
              <span className="text-neutral-500">$</span>
              <span className="text-[#00c950] font-medium">npx @ticket-assistant/cli init</span>
              <button 
                onClick={() => copyToClipboard('npx @ticket-assistant/cli init', 'cli-hero')}
                className="p-1 hover:text-white text-neutral-400 transition-colors cursor-pointer"
                title="Copy command"
              >
                {copiedCmd === 'cli-hero' ? <Check className="h-4 w-4 text-[#00c950]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <button 
              onClick={onOpenDocs}
              className="btn-primary w-full sm:w-auto"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>

            <a 
              href="https://www.npmjs.com/package/@ticket-assistant/cli" 
              target="_blank" 
              rel="noreferrer"
              className="btn-secondary w-full sm:w-auto"
            >
              npm Package <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            </a>
          </div>

          {/* Divided Stat Metric Pill (WeMakeDevs style) */}
          <div className="inline-flex flex-wrap sm:flex-nowrap items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-xl border border-white/15 bg-[#08090d]/80 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col gap-1 px-6 py-3.5 text-left">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#00c950]">200ms</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Triage Latency</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-3.5 text-left">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#00c950]">0 Queues</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">No Redis Lock-in</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-3.5 text-left">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#00c950]">100%</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">Open Source</span>
            </div>
            <div className="flex flex-col gap-1 px-6 py-3.5 text-left">
              <span className="font-mono text-xl sm:text-2xl font-bold text-[#00c950]">TypeScript</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">First-Class Types</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Logos Marquee */}
      <section className="py-6 border-b border-white/10 bg-[#0e1017]/30">
        <div className="max-w-7xl mx-auto px-5 flex flex-wrap items-center justify-between gap-6 text-xs font-mono uppercase tracking-wider text-neutral-500">
          <span className="text-[#00c950] font-semibold">Integrates With:</span>
          <span>Next.js App Router</span>
          <span>Express.js</span>
          <span>MongoDB Atlas</span>
          <span>Supabase Postgres</span>
          <span>Google Gemini</span>
          <span>Groq</span>
          <span>OpenAI</span>
          <span>Node Native Crypto</span>
        </div>
      </section>

      {/* Feature Grid Section (02 / CORE ENGINE) */}
      <section id="features" className="py-20 border-b border-dashed border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-[#00c950] font-semibold mb-2">
                02 / ARCHITECTURE & CAPABILITIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Everything you need to automate support triage.
              </h2>
            </div>
            <p className="max-w-md text-sm text-neutral-400 font-mono">
              Engineered to embed into existing production applications without forcing external auth databases or proprietary cloud queues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="corner-bracket-container p-6 rounded-lg border border-white/10 bg-[#0e1017]/50 hover:border-white/20 transition-all">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>
              
              <div className="size-10 rounded-[4px] bg-[#00c950]/10 border border-[#00c950]/30 flex items-center justify-center text-[#00c950] mb-5">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Autonomous AI Triage</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Evaluates inbound tickets in real time, generates issue summaries, estimates SLA priority (low/medium/high), and drafts troubleshooting notes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="corner-bracket-container p-6 rounded-lg border border-white/10 bg-[#0e1017]/50 hover:border-white/20 transition-all">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <div className="size-10 rounded-[4px] bg-[#00c950]/10 border border-[#00c950]/30 flex items-center justify-center text-[#00c950] mb-5">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Skill-Based Routing</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                AI extracts necessary technical skills from tickets and matches them to the support agent with the highest overlapping competencies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="corner-bracket-container p-6 rounded-lg border border-white/10 bg-[#0e1017]/50 hover:border-white/20 transition-all">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <div className="size-10 rounded-[4px] bg-[#00c950]/10 border border-[#00c950]/30 flex items-center justify-center text-[#00c950] mb-5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Built-in Agent Auth</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Native scrypt password salting and constant-time verifyAgentCredentials helper. Zero external bcrypt C++ build dependencies.
              </p>
            </div>

            {/* Card 4 */}
            <div className="corner-bracket-container p-6 rounded-lg border border-white/10 bg-[#0e1017]/50 hover:border-white/20 transition-all">
              <div className="corner-bracket-tl"></div>
              <div className="corner-bracket-tr"></div>
              <div className="corner-bracket-bl"></div>
              <div className="corner-bracket-br"></div>

              <div className="size-10 rounded-[4px] bg-[#00c950]/10 border border-[#00c950]/30 flex items-center justify-center text-[#00c950] mb-5">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Pluggable Storage</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Zero-setup auto collection creation in MongoDB, clean SQL schema for Supabase, or extend BaseStorageAdapter for MySQL & Prisma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code Showcase Section (03 / CODE WALKTHROUGH) */}
      <section id="code" className="py-20 border-b border-dashed border-white/10">
        <div className="max-w-6xl mx-auto px-5 lg:px-12">
          <div className="text-center mb-12">
            <div className="font-mono text-xs uppercase tracking-wider text-[#00c950] font-semibold mb-2">
              03 / PRODUCTION READY IN SECONDS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Developer-First API Design
            </h2>
            <p className="text-sm text-neutral-400 font-mono">
              Designed for clean readability, type safety, and seamless integration.
            </p>
          </div>

          {/* Interactive Code Window */}
          <div className="rounded-lg border border-white/15 bg-[#0a0c10] shadow-2xl overflow-hidden">
            {/* Window Header */}
            <div className="border-b border-white/10 bg-[#0e1017] px-4 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80"></div>
                <div className="size-3 rounded-full bg-yellow-500/80"></div>
                <div className="size-3 rounded-full bg-green-500/80"></div>
                <span className="ml-3 font-mono text-xs text-neutral-400">ticket-assistant-workspace</span>
              </div>

              {/* Code Tabs */}
              <div className="flex items-center gap-1 bg-[#08090d] p-1 rounded border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setActiveCodeTab('cli')}
                  className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                    activeCodeTab === 'cli' ? 'bg-[#00c950] text-[#08090d] font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  CLI Setup
                </button>
                <button
                  onClick={() => setActiveCodeTab('nextjs')}
                  className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                    activeCodeTab === 'nextjs' ? 'bg-[#00c950] text-[#08090d] font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Next.js Route
                </button>
                <button
                  onClick={() => setActiveCodeTab('auth')}
                  className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                    activeCodeTab === 'auth' ? 'bg-[#00c950] text-[#08090d] font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Agent Auth
                </button>
                <button
                  onClick={() => setActiveCodeTab('config')}
                  className={`px-3 py-1 rounded-sm transition-colors cursor-pointer ${
                    activeCodeTab === 'config' ? 'bg-[#00c950] text-[#08090d] font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ticket.config.js
                </button>
              </div>

              <button
                onClick={() => copyToClipboard(codeSnippets[activeCodeTab], 'active-tab')}
                className="btn-secondary !px-2.5 !py-1 !text-xs !normal-case flex items-center gap-1.5"
              >
                {copiedCmd === 'active-tab' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#00c950]" />
                    <span className="font-mono text-xs text-[#00c950]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="font-mono text-xs">Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-x-auto font-mono text-xs leading-relaxed text-neutral-200 bg-[#08090d]">
              <pre>
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Database Setup Section (04 / DATABASE ADAPTERS) */}
      <section id="architecture" className="py-20 border-b border-dashed border-white/10">
        <div className="max-w-6xl mx-auto px-5 lg:px-12">
          <div className="font-mono text-xs uppercase tracking-wider text-[#00c950] font-semibold mb-2">
            04 / PLUGGABLE STORAGE COMPARISON
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-10">
            Pick your database. Zero schema conflicts.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MongoDB Card */}
            <div className="p-8 rounded-lg border border-white/10 bg-[#0e1017]/40 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#00c950]"></span> MongoDB Atlas
                </span>
                <span className="text-xs font-mono uppercase text-[#00c950] border border-[#00c950]/30 px-2 py-0.5 rounded">
                  0-Config Setup
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-mono">
                No manual migration steps required. Collections and indexes are automatically created on first write.
              </p>
              <ul className="space-y-3 text-xs font-mono text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Auto-created collection: <code className="text-[#00c950]">ticketai_tickets</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Auto-created collection: <code className="text-[#00c950]">ticketai_agents</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Reuses existing active Mongoose connections</span>
                </li>
              </ul>
            </div>

            {/* Supabase Card */}
            <div className="p-8 rounded-lg border border-white/10 bg-[#0e1017]/40 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#00c950]"></span> Supabase / PostgreSQL
                </span>
                <span className="text-xs font-mono uppercase text-[#00c950] border border-[#00c950]/30 px-2 py-0.5 rounded">
                  Isolated SQL Schema
                </span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 font-mono">
                Namespaced tables isolate customer support tickets from your application's user tables.
              </p>
              <ul className="space-y-3 text-xs font-mono text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Namespaced table: <code className="text-[#00c950]">ticketai_tickets</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Namespaced table: <code className="text-[#00c950]">ticketai_agents</code></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#00c950]" />
                  <span>Includes pre-configured schema.sql with indexes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <div className="font-mono text-xs uppercase tracking-wider text-[#00c950] font-semibold mb-3">
            05 / READY TO SHIP?
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-6">
            Get autonomous AI support up and running in 30 seconds.
          </h2>
          <p className="text-neutral-400 font-mono text-sm max-w-xl mx-auto mb-10">
            Open-source, self-hosted, zero external queue lock-in. Free to use under the ISC license.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onOpenDocs}
              className="btn-primary !px-6 !py-3 w-full sm:w-auto text-sm"
            >
              Explore Documentation <ArrowRight className="h-4 w-4" />
            </button>
            <a 
              href="https://github.com/Rudra2637/Ai-Ticket-Assistant"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !px-6 !py-3 w-full sm:w-auto text-sm"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[#050608]">
        <div className="max-w-7xl mx-auto px-5 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-[3px] bg-[#00c950]/15 border border-[#00c950]/30 flex items-center justify-center text-[#00c950] font-mono font-bold text-xs">
              &lt;/&gt;
            </div>
            <span className="font-mono text-xs text-neutral-400">
              Ticket Assistant &copy; 2026. ISC Licensed.
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-neutral-400">
            <button onClick={onOpenDocs} className="hover:text-white transition-colors cursor-pointer">
              Docs
            </button>
            <a href="https://www.npmjs.com/package/@ticket-assistant/core" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Core Package
            </a>
            <a href="https://www.npmjs.com/package/@ticket-assistant/cli" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              CLI Package
            </a>
            <a href="https://github.com/Rudra2637/Ai-Ticket-Assistant" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
