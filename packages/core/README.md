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

Use OpenDesk directly within web-standard API route handlers without needing an Express server:

```typescript
import { TicketAssistant } from '@ticket-assistant/core';

// Initialize the assistant instance (singleton recommended)
export const assistant = new TicketAssistant({
  storage: 'supabase', // or 'mongo'
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ai: {
    apiKey: process.env.GROQ_API_KEY, // or OPENAI_API_KEY
    model: 'openai/gpt-oss-20b'       // or 'gpt-4o-mini'
  }
});

// Create a new support ticket (triggers async AI triage automatically)
const ticket = await assistant.createTicket({
  title: "Cannot reset password via email",
  description: "When clicking the reset link in the email, it shows a 404 token expired error.",
  createdBy: "usr_123456"
});

// Fetch tickets with optional status or assignment filtering
const openTickets = await assistant.getTickets({ status: "TODO" });

// Fetch matching support agents
const agents = await assistant.getAgents();
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

## 🤖 AI Providers

OpenDesk supports any OpenAI-compatible completions API using native zero-dependency HTTP `fetch`:

```javascript
// Example: Using Groq (default for ultra-fast <500ms triage)
const assistant = new TicketAssistant({
  ai: {
    apiKey: process.env.GROQ_API_KEY,
    model: 'openai/gpt-oss-20b'
  }
});

// Example: Using OpenAI
const assistant = new TicketAssistant({
  ai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini'
  }
});

// Example: Local Ollama
const assistant = new TicketAssistant({
  ai: {
    baseUrl: 'http://localhost:11434/v1',
    model: 'llama3'
  }
});
```

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
