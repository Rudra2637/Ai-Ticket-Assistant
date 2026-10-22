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
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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
      { id: 'supabase', label: 'PostgreSQL (Supabase)' },
      { id: 'custom-storage', label: 'Custom Storage Adapter' }
    ]
  },
  {
    title: 'AI Providers',
    icon: Bot,
    items: [
      { id: 'groq', label: 'Groq (Ultra-fast)' },
      { id: 'gemini', label: 'Google Gemini' },
      { id: 'openai', label: 'OpenAI GPT-4o' },
      { id: 'ollama', label: 'Local Ollama' }
    ]
  },
  {
    title: 'Agent Authentication',
    icon: ShieldCheck,
    items: [
      { id: 'agent-auth', label: 'Overview & Auto-Hashing' },
      { id: 'credentials', label: 'Credentials Verification' },
      { id: 'nextauth', label: 'NextAuth / Auth.js Recipe' }
    ]
  },
  {
    title: 'Framework Guides',
    icon: Layers,
    items: [
      { id: 'nextjs', label: 'Next.js (App Router)' },
      { id: 'express', label: 'Express.js Server' }
    ]
  },
  {
    title: 'API Reference',
    icon: Terminal,
    items: [
      { id: 'api-core', label: 'TicketAssistant Class' },
      { id: 'api-cli', label: 'CLI Commands' }
    ]
  }
];

export default function App() {
  const [activeItem, setActiveItem] = useState('intro');
  const [copied, setCopied] = useState(false);

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight text-white">Ticket Assistant</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              v1.0.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs text-slate-400">
            <Search className="h-3.5 w-3.5" />
            <span>Search docs...</span>
            <kbd className="ml-3 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-300">⌘K</kbd>
          </div>
          <a
            href="https://github.com/Rudra2637/Ai-Ticket-Assistant"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-900/80 pr-6">
          <nav className="space-y-6">
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <sec.icon className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{sec.title}</span>
                </div>
                <ul className="space-y-1">
                  {sec.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveItem(item.id)}
                        className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                          activeItem === item.id
                            ? 'bg-indigo-600/10 text-indigo-400 font-medium border-l-2 border-indigo-500'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
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

        {/* Content Area */}
        <main className="flex-1 min-w-0 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-3">
              <span>Documentation</span>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="capitalize">{activeItem.replace('-', ' ')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ticket Assistant Documentation Template
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              The headless, embeddable, AI-powered support ticket triage and routing framework for modern web stacks.
            </p>
          </div>

          {/* Quick Install Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 mb-8">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              Quick Installation
            </h2>
            <div className="relative rounded-lg bg-slate-950 border border-slate-800/80 p-3 font-mono text-sm text-slate-200 flex items-center justify-between">
              <code>npx @ticket-assistant/cli init</code>
              <button
                onClick={() => copyCode('npx @ticket-assistant/cli init')}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Feature Grid Outline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
              <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-400" />
                Pluggable Databases
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-setup auto collections in MongoDB, clean SQL schema for Supabase, or extend BaseStorageAdapter.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
              <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                AI Issue Triage
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated priority estimation, skill matching, and notes generation via Groq, Gemini, or OpenAI.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
              <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Built-in Agent Auth
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-dependency scrypt password hashing with constant-time verifyAgentCredentials helper.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20">
              <h3 className="font-semibold text-sm text-white mb-1 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                Full Framework Support
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Built-in TypeScript declarations for Next.js App Router, Server Actions, or classic Express.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
