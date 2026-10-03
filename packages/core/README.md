# @ticket-assistant/core (OpenDesk Core)

> **Headless, embeddable, AI-powered support ticket triage and routing framework.**

[![npm version](https://img.shields.io/npm/v/@ticket-assistant/core.svg)](https://www.npmjs.com/package/@ticket-assistant/core)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

`@ticket-assistant/core` is an unopinionated backend engine that gives your application an enterprise-grade customer support triage loop with zero external queue dependencies.

---

## 📦 Installation

```bash
npm install @ticket-assistant/core
```

*(Optional)* If you plan to use the built-in Express router adapter:
```bash
npm install express cors
```

---

##  Quick Start

### 1. Direct Programmatic API (Next.js, Remix, Serverless)

Use OpenDesk directly within web-standard API route handlers without needing an Express server.

#### Step A: Configure `next.config.ts`
Add `@ticket-assistant/core` to `serverExternalPackages` so Next.js treats it as a backend server module:
```typescript
// next.config.ts
const nextConfig = {
  serverExternalPackages: ['@ticket-assistant/core'],
};
export default nextConfig;
```

#### Step B: Create `ticket.config.js`
```javascript
// ticket.config.js
import { defineConfig } from '@ticket-assistant/core';

export default defineConfig({
  storage: {
    provider: 'supabase', // or 'mongo'
    supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
  },
  ai: {
    apiKey: process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY,
    model: process.env.AI_MODEL || 'gemini-2.0-flash'
  },
  agents: [
    {
      name: 'Global Support Lead',
      email: 'support@mycompany.com',
      skills: ['Payments', 'Billing', 'Account', 'Technical']
    }
  ]
});
```

#### Step C: Create the Singleton Helper (`src/lib/ticket-assistant.ts`)
```typescript
// src/lib/ticket-assistant.ts
import { TicketAssistant } from '@ticket-assistant/core';
import config from '../../ticket.config.js';

let assistantInstance: TicketAssistant | null = null;
let seeded = false;

export function getTicketAssistant(): TicketAssistant {
  if (!assistantInstance) {
    assistantInstance = new TicketAssistant(config);
  }
  return assistantInstance;
}

export async function ensureAgentsSeeded() {
  if (seeded) return;
  const assistant = getTicketAssistant();
  await assistant.seedAgents();
  seeded = true;
}
```

#### Step D: Route Handlers (`src/app/api/support/tickets/route.ts`)
```typescript
import { NextResponse } from 'next/server';
import { getTicketAssistant, ensureAgentsSeeded } from '@/lib/ticket-assistant';

export async function GET() {
  await ensureAgentsSeeded();
  const assistant = getTicketAssistant();
  const tickets = await assistant.getTickets();
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  await ensureAgentsSeeded();
  const assistant = getTicketAssistant();
  const { title, description } = await req.json();

  const ticket = await assistant.createTicket({
    title,
    description
  });

  return NextResponse.json(ticket, { status: 201 });
}
```

---

### 2. Express Server Integration

If you run an Express backend, OpenDesk includes a pre-configured lazy-loaded router:

```javascript
import express from 'express';
import { TicketAssistant } from '@ticket-assistant/core';

const app = express();
app.use(express.json());

const assistant = new TicketAssistant({
  storage: 'mongo',
  mongoUri: process.env.MONGODB_URI,
  auth: {
    // Customer auth middleware: protects ticket submission & viewing
    middleware: (req, res, next) => {
      if (!req.headers.authorization) return res.status(401).json({ error: "Unauthorized" });
      next();
    },
    // Agent auth middleware: protects ticket assignment & status updates
    agentMiddleware: (req, res, next) => {
      // Custom role verification
      next();
    }
  }
});

await assistant.connect();

// Mounts:
// GET    /api/tickets       - List tickets (with ?status, ?assignedTo filters)
// POST   /api/tickets       - Create ticket & trigger background AI triage
// GET    /api/tickets/:id   - Fetch single ticket details & AI notes
// PATCH  /api/tickets/:id   - Update status or reassign ticket
// GET    /api/agents        - List support agents
// POST   /api/agents        - Register a new support agent
// PATCH  /api/agents/:id    - Update agent skills or details
// DELETE /api/agents/:id    - Delete agent
app.use('/api', await assistant.getRouter());

app.listen(3000, () => console.log('Support API running on port 3000'));
```

---

## 🗄️ Storage Proxies

OpenDesk isolates all data using namespaced tables (`ticketai_*`), ensuring zero interference with your app's existing schema.

### Supabase (PostgreSQL)
```javascript
const assistant = new TicketAssistant({
  storage: 'supabase',
  supabaseUrl: 'https://xyz.supabase.co',
  supabaseKey: 'service-role-key'
});
```

Create the tables once in Supabase SQL editor:
```sql
CREATE TABLE IF NOT EXISTS ticketai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
```

### MongoDB (Mongoose)
```javascript
const assistant = new TicketAssistant({
  storage: 'mongo',
  mongoUri: 'mongodb+srv://user:pass@cluster.mongodb.net/dbname'
});
```
Mongoose automatically manages `ticketai_tickets` and `ticketai_agents` schemas.

---

## 🤖 AI Providers & Model Configuration

OpenDesk supports any OpenAI-compatible completions API using native zero-dependency HTTP `fetch`. The provider endpoint is automatically resolved from your environment variables:

```javascript
// Example 1: Google Gemini (automatic endpoint resolution)
const assistant = new TicketAssistant({
  ai: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash' // or 'gemini-1.5-flash', 'gemini-1.5-pro'
  }
});

// Example 2: Groq (high-speed inference)
const assistant = new TicketAssistant({
  ai: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'openai/gpt-oss-20b' // or 'qwen/qwen3.8-27b'
  }
});

// Example 3: OpenAI
const assistant = new TicketAssistant({
  ai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini' // or 'gpt-4o'
  }
});

// Example 4: Local Ollama / Custom vLLM
const assistant = new TicketAssistant({
  ai: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3'
  }
});
```

> **Note**: OpenDesk never hardcodes default AI models. You can use any model supported by your provider by supplying `model` in your configuration or `AI_MODEL` in your environment.

---

## 📚 Programmatic API Reference

### Tickets
* `assistant.createTicket({ title, description, createdBy })`: Creates ticket and launches async triage loop.
* `assistant.getTickets(filter)`: Returns array of tickets matching optional `{ status, assignedTo, createdBy }`.
* `assistant.getTicket(id)`: Returns ticket by ID.
* `assistant.updateTicket(id, updates)`: Updates status, priority, or assigned agent.

### Agents
* `assistant.createAgent({ name, email, skills })`: Adds a support agent for AI routing.
* `assistant.getAgents()`: Returns all registered agents and their skill keywords.
* `assistant.getAgentByEmail(email)`: Finds agent by email.
* `assistant.updateAgent(id, updates)`: Updates agent skills or name.
* `assistant.deleteAgent(id)`: Deletes an agent.

---

## 📄 License

ISC License &copy; 2026 OpenDesk Contributors.
