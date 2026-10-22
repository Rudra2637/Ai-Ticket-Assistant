# @ticket-assistant/docs

The official documentation website for **Ticket Assistant** — the headless, embeddable, AI-powered support ticket triage and routing framework.

---

## 📚 Documentation Site Architecture

This template defines the documentation structure, navigation tree, and content categories:

```
packages/docs/
├── package.json
├── README.md
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx         # Top navigation bar with search, github link, version badge
│   │   ├── Sidebar.jsx        # Collapsible category navigation tree
│   │   ├── CodeBlock.jsx      # Syntax-highlighted code block with 1-click copy
│   │   ├── Callout.jsx        # Note, Warning, Tip alert banners
│   │   └── SearchModal.jsx    # Quick search modal (Cmd+K)
│   ├── layouts/
│   │   └── DocsLayout.jsx     # Master responsive 3-column layout (sidebar, content, table of contents)
│   ├── pages/
│   │   ├── Home.jsx           # Docs landing page with quick links
│   │   └── DocPage.jsx        # Dynamic markdown / doc section renderer
│   └── content/               # Documentation Markdown / content definitions
│       ├── 01-getting-started/
│       │   ├── introduction.md
│       │   ├── installation.md
│       │   ├── quickstart-cli.md
│       │   └── configuration.md
│       ├── 02-database-adapters/
│       │   ├── mongodb.md
│       │   ├── supabase.md
│       │   └── custom-adapters.md
│       ├── 03-ai-providers/
│       │   ├── groq.md
│       │   ├── gemini.md
│       │   ├── openai.md
│       │   └── ollama.md
│       ├── 04-agent-auth/
│       │   ├── overview.md
│       │   ├── credentials.md
│       │   ├── nextauth-integration.md
│       │   └── server-actions.md
│       ├── 05-framework-guides/
│       │   ├── nextjs-app-router.md
│       │   └── express-js.md
│       └── 06-api-reference/
│           ├── ticket-assistant-class.md
│           └── cli-commands.md
```

---

## 🚀 Navigation Outline

| Category | Articles | Description |
| :--- | :--- | :--- |
| **1. Getting Started** | Intro, Installation, CLI Quickstart, Config | Everything needed to install and configure `@ticket-assistant/core` and `@ticket-assistant/cli` |
| **2. Database Adapters** | MongoDB, Supabase (PostgreSQL), Custom Adapter | Zero-setup MongoDB guide, Supabase SQL schema, and extending `BaseStorageAdapter` |
| **3. AI Providers** | Groq, Gemini, OpenAI, Ollama | Configuring AI triage providers, model overrides, and background evaluation |
| **4. Agent Auth** | Password Hashing, Verification Helper, NextAuth | Built-in zero-dependency credentials verification and session integration recipes |
| **5. Framework Guides** | Next.js App Router, Express.js | Production-ready route handlers, TypeScript setups, and server mounting |
| **6. API Reference** | `TicketAssistant` API, CLI Options | Complete reference for all methods, options, and types |
