import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

const execAsync = promisify(exec);

function getConfigContent(dbChoice, aiChoice) {
    const aiKeyMap = {
        groq: 'GROQ_API_KEY',
        openai: 'OPENAI_API_KEY',
        claude: 'ANTHROPIC_API_KEY',
        gemini: 'GEMINI_API_KEY'
    };

    const dbOptions = dbChoice === 'mongo'
        ? 'url: process.env.MONGODB_URI || process.env.DATABASE_URL'
        : 'url: process.env.SUPABASE_URL,\n      key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY';

    return `import { defineConfig } from '@ticket-assistant/core';

export default defineConfig({
  storage: {
    provider: '${dbChoice}',
    options: {
      ${dbOptions}
    }
  },
  ai: {
    provider: '${aiChoice}',
    options: {
      apiKey: process.env.${aiKeyMap[aiChoice] || 'AI_API_KEY'}
    }
  },
  auth: {
    // 1. Customer auth: users creating & viewing their tickets
    middleware: (req, res, next) => next(),

    // 2. Agent auth: staff updating ticket status & responses
    agentMiddleware: (req, res, next) => next(),

    // 3. Admin auth: staff managing agent roster
    adminMiddleware: (req, res, next) => next()
  }
});
`;
}

function getPackageJsonContent(projectName) {
    return JSON.stringify({
        name: projectName,
        version: "1.0.0",
        type: "module",
        scripts: {
            "dev": "node server.js",
            "start": "node server.js"
        },
        dependencies: {
            "@ticket-assistant/core": "^1.0.0",
            "express": "^4.21.0",
            "dotenv": "^16.4.5"
        }
    }, null, 2);
}

function getServerContent() {
    return `import express from 'express';
import 'dotenv/config';
import { TicketAssistant } from '@ticket-assistant/core';
import config from './ticket.config.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const assistant = new TicketAssistant(config);
await assistant.connect();

// Mount TicketAI endpoints under /api (/api/tickets, /api/agents)
app.use('/api', assistant.getRouter());

app.listen(port, () => {
    console.log(\`🚀 Ticket Assistant running on http://localhost:\${port}\`);
});
`;
}

function getSchemaSqlContent() {
    return `-- ==========================================================
-- TicketAI Supabase / PostgreSQL Schema
-- Run this in your Supabase SQL Editor to set up your tables
-- ==========================================================

-- 1. Create TicketAI Agents Table (Support Staff)
CREATE TABLE IF NOT EXISTS ticketai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create TicketAI Tickets Table
CREATE TABLE IF NOT EXISTS ticketai_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_by TEXT,
    assigned_to UUID REFERENCES ticketai_agents(id) ON DELETE SET NULL,
    related_skills TEXT[] DEFAULT '{}',
    helpful_notes TEXT DEFAULT '',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_ticketai_agents_email ON ticketai_agents(email);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_status ON ticketai_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_assigned_to ON ticketai_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_created_by ON ticketai_tickets(created_by);
`;
}

export async function generateProject(options) {
    const s = spinner();
    s.start("Scaffolding project files...");

    // Generate dynamic ticket.config.js content
    const configContent = getConfigContent(options.dbChoice, options.aiChoice);

    if (options.isInit) {
        // ----------------------------------------------------
        // CASE 1: EXISTING PROJECT (ticket-ai init)
        // ----------------------------------------------------
        // 1. Write ticket.config.js in targetDir
        fs.writeFileSync(path.join(options.targetDir, "ticket.config.js"), configContent);

        // 2. If Supabase, generate schema.sql so the user can easily run it
        if (options.dbChoice === 'supabase') {
            fs.writeFileSync(path.join(options.targetDir, "schema.sql"), getSchemaSqlContent());
        }

        // (We do NOT touch .env in existing projects!)

        // 3. Install @ticket-assistant/core if user confirmed
        if (options.shouldInstall) {
            s.message(`Installing @ticket-assistant/core with ${options.pm.name}...`);
            try {
                await execAsync(`${options.pm.installCmd} @ticket-assistant/core`, { cwd: options.targetDir });
            } catch (err) {
                console.log(pc.yellow(`\n⚠ Could not auto-install. Run '${options.pm.installCmd} @ticket-assistant/core' manually.`));
            }
        }
    } else {
        // ----------------------------------------------------
        // CASE 2: NEW PROJECT (npm create ticket-ai <name>)
        // ----------------------------------------------------
        // 1. Create the new project folder first!
        await fs.ensureDir(options.targetDir);

        // 2. Create package.json inside targetDir
        fs.writeFileSync(path.join(options.targetDir, "package.json"), getPackageJsonContent(options.projectName));

        // 3. Create ticket.config.js inside targetDir
        fs.writeFileSync(path.join(options.targetDir, "ticket.config.js"), configContent);

        // 4. Create server.js inside targetDir
        fs.writeFileSync(path.join(options.targetDir, "server.js"), getServerContent());

        // 5. If Supabase, create schema.sql inside targetDir
        if (options.dbChoice === 'supabase') {
            fs.writeFileSync(path.join(options.targetDir, "schema.sql"), getSchemaSqlContent());
        }

        // 6. Create .env inside targetDir (for new projects only)
        const aiEnvKey = {
            groq: 'GROQ_API_KEY=your_groq_api_key',
            openai: 'OPENAI_API_KEY=your_openai_api_key',
            claude: 'ANTHROPIC_API_KEY=your_claude_api_key',
            gemini: 'GEMINI_API_KEY=your_gemini_api_key'
        }[options.aiChoice] || 'AI_API_KEY=your_api_key';

        const dbEnv = options.dbChoice === 'mongo'
            ? 'MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tickets'
            : 'SUPABASE_URL=https://your-project.supabase.co\nSUPABASE_KEY=your_key';

        const envContent = `# Database\n${dbEnv}\n\n# AI Provider\n${aiEnvKey}\n\nPORT=3000\n`;
        fs.writeFileSync(path.join(options.targetDir, ".env"), envContent);

        // 7. Create .gitignore inside targetDir
        fs.writeFileSync(path.join(options.targetDir, ".gitignore"), "node_modules\n.env\n");

        // 8. Install dependencies if user confirmed
        if (options.shouldInstall) {
            s.message(`Installing dependencies with ${options.pm.name}...`);
            try {
                const cmd = options.pm.name === 'npm' ? 'npm install' : `${options.pm.name} install`;
                await execAsync(cmd, { cwd: options.targetDir });
            } catch (err) {
                console.log(pc.yellow(`\n⚠ Could not auto-install. Run '${options.pm.name} install' manually.`));
            }
        }
    }

    s.stop("Project scaffolded successfully! 🎉");
}

