# create-ticket-ai (OpenDesk CLI)

> **Interactive CLI to scaffold or integrate OpenDesk into your application in seconds.**

[![npm version](https://img.shields.io/npm/v/create-ticket-ai.svg)](https://www.npmjs.com/package/create-ticket-ai)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

---

## 🚀 Quick Usage

### 1. Initialize inside an Existing Project (`init` mode)

Add OpenDesk customer support to your existing Next.js, Express, or Node.js codebase:

```bash
cd my-existing-project
npx create-ticket-ai init
```

The CLI will:
1. Detect your framework (Next.js App Router vs Express server).
2. Ask you to select your database (**Supabase** or **MongoDB**).
3. Ask you to select your AI engine (**Groq** or **OpenAI**).
4. Install `@ticket-assistant/core` into your project.
5. Create a `ticket.config.js` with your configuration.
6. Provide starter route handlers tailored to your framework.

---

### 2. Create a Brand New Project (Scaffold mode)

Scaffold a complete, standalone support backend from scratch:

```bash
npx create-ticket-ai my-support-app
```

Or pass flags to skip interactive prompts:

```bash
npx create-ticket-ai my-support-app --template=express --storage=supabase --ai=groq
```

---

## 🛠️ CLI Flags & Options

| Flag | Description | Values |
| :--- | :--- | :--- |
| `init` | Run in existing project mode | N/A |
| `--template` | Choose server framework | `express`, `nextjs` |
| `--storage` | Choose database engine | `supabase`, `mongo` |
| `--ai` | Choose AI completions provider | `groq`, `openai` |
| `--yes`, `-y` | Accept defaults non-interactively | N/A |

---

## 📄 License

ISC License &copy; 2026 OpenDesk Contributors.
