import express from 'express';
import cors from 'cors';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client.js';
import { onUserSignUp } from './inngest/functions/on-userSignup.js';
import { onticketCreate } from './inngest/functions/on-ticket-create.js';
import userRoutes from './routes/user.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import { createStorage } from './storage/index.js';
import { createAI } from './ai/index.js';


export class TicketAssistant {

    constructor(config = {}) {
        this.storage = createStorage(config.storage || { provider: config.database });
        this.ai = createAI(config.ai || { provider: config.aiProvider });
    }

    async connect() {
        if (typeof this.storage.connect === 'function') {
            await this.storage.connect();
        }
    }

    getRouter() {
        const router = express.Router()
        router.use(cors());
        router.use(express.json());
        router.use('/auth', userRoutes);
        router.use('/tickets', ticketRoutes);
        router.use('/inngest', serve({
            client: inngest,
            functions: [onUserSignUp, onticketCreate]
        }));
        return router;
    }
}

// Export base classes so developers can build custom DB or AI adapters!
export * from './storage/base.storage.js';
export * from './storage/mongo.storage.js';
export * from './storage/supabase.storage.js';
export * from './ai/base.ai.js';
export * from './ai/default.ai.js';