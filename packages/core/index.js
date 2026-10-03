import { createAI, setActiveAI } from './ai/index.js';
import { createStorage, setActiveStorage } from './storage/index.js';
import { onticketCreate } from './utils/on-ticket-create.js';

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

    // ==========================================================
    // Direct Core API (Pure JS / Next.js / Serverless Friendly)
    // ==========================================================

    /**
     * Create a ticket, save to storage, and automatically trigger background AI triage.
     */
    async createTicket({ title, description, createdBy = null }) {
        if (!title || !description) {
            throw new Error("Title and description are required to create a ticket");
        }

        const ticket = await this.storage.createTicket({
            title,
            description,
            createdBy: createdBy?.toString() || null
        });

        // Trigger AI triage in the background (non-blocking)
        onticketCreate({
            id: ticket.id || ticket._id,
            title,
            description
        }).catch(err => console.error("[onTicketCreate] Background triage error:", err));

        return ticket;
    }

    async getTickets(filter = {}) {
        return this.storage.getTickets(filter);
    }

    async getTicket(id) {
        return this.storage.getTicketById(id);
    }

    async updateTicket(id, updates) {
        return this.storage.updateTicket(id, updates);
    }

    async createAgent(data) {
        return this.storage.createAgent(data);
    }

    async getAgents() {
        return this.storage.getAgents();
    }

    async getAgentByEmail(email) {
        return this.storage.getAgentByEmail(email);
    }

    async updateAgent(id, updates) {
        return this.storage.updateAgent(id, updates);
    }

    async deleteAgent(id) {
        return this.storage.deleteAgent(id);
    }

    /**
     * Seeds initial agents defined in config.agents.
     * Idempotent: Checks if agent already exists by email before inserting.
     */
    async seedAgents() {
        if (!Array.isArray(this.config.agents)) return [];
        const seeded = [];
        for (const agentData of this.config.agents) {
            if (!agentData?.email) continue;
            const existing = await this.getAgentByEmail(agentData.email);
            if (!existing) {
                const created = await this.createAgent(agentData);
                seeded.push(created);
            }
        }
        return seeded;
    }

    // ==========================================================
    // Express Adapter (Lazy-Loaded: Express is only loaded on demand)
    // ==========================================================

    /**
     * Creates and returns an Express Router.
     * Express and cors are dynamically loaded so non-Express projects (like Next.js)
     * never throw 'Cannot find package express'.
     */
    async getRouter() {
        const express = (await import('express')).default;
        const cors = (await import('cors')).default;
        const { default: agentRoutes } = await import('./routes/agent.routes.js');
        const { createTicketRouter } = await import('./routes/ticket.routes.js');

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

        // 3. Boot Express dynamically
        const express = (await import('express')).default;
        const app = express();
        const port = options.port || this.config.server?.port || process.env.PORT || 3000;
        const router = await this.getRouter();
        app.use(router);

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
export { onticketCreate } from './utils/on-ticket-create.js';

