import express from 'express';
import cors from 'cors';
import agentRoutes from './routes/agent.routes.js';
import { createTicketRouter } from './routes/ticket.routes.js';
import { createAI, setActiveAI } from './ai/index.js';
import { createStorage, setActiveStorage } from './storage/index.js';

/**
 * Config helper — like Vite's defineConfig
 */
export function defineConfig(config) {
    return config;
}

export class TicketAssistant {

    constructor(config = {}) {
        this.config = config;

        this.storage = createStorage(config.storage || { provider: config.database });
        if (this.storage) setActiveStorage(this.storage);

        this.ai = createAI(config.ai || { provider: config.aiProvider });
        if (this.ai) setActiveAI(this.ai);
    }

    async connect() {
        if (typeof this.storage.connect === 'function') {
            await this.storage.connect();
        }
    }

    getRouter() {
        const router = express.Router();
        router.use(cors());
        router.use(express.json());

        // Agent management: admin only
        if (this.config.auth?.adminMiddleware) {
            router.use('/agents', this.config.auth.adminMiddleware);
        }
        router.use('/agents', agentRoutes);

        // Tickets: route-level separation for customer and agent auth tiers
        router.use('/tickets', createTicketRouter(this.config.auth || {}));

        return router;
    }

    /**
     * Seed agents from config on first boot.
     * Only inserts agents that don't already exist.
     */
    async seedAgents() {
        if (!this.config.agents?.length) return;

        for (const agentData of this.config.agents) {
            const existing = await this.storage.getAgentByEmail(agentData.email);
            if (!existing) {
                await this.storage.createAgent(agentData);
                console.log(`  ✅ Seeded agent: ${agentData.email}`);
            }
        }
    }

    async startServer(options = {}) {
        await this.connect();

        // 1. Run migrations if supported
        if (typeof this.storage.runMigrations === 'function') {
            const tablesReady = await this.storage.runMigrations();
            if (tablesReady === false) {
                console.error("\n⛔ Tables not found. Run the SQL printed above in your database, then restart.\n");
                process.exit(1);
            }
        }

        // 2. Seed agents
        await this.seedAgents();

        // 3. Boot Express
        const app = express();
        const port = options.port || this.config.server?.port || process.env.PORT || 3000;
        app.use(this.getRouter());

        return new Promise((resolve) => {
            const server = app.listen(port, () => {
                console.log(`\n🚀 TicketAI server running on http://localhost:${port}`);
                console.log(`   Routes: /tickets, /agents\n`);
                resolve({ app, server, port });
            });
        });
    }
}

// Export base classes so developers can build custom DB or AI adapters!
export * from './storage/base.storage.js';
export * from './storage/mongo.storage.js';
export * from './storage/supabase.storage.js';
export * from './ai/base.ai.js';
export * from './ai/default.ai.js';