import 'dotenv/config';
import express from 'express';
import { TicketAssistant } from './index.js';

const app = express();
const port = process.env.PORT || 3000;

const assistant = new TicketAssistant();
await assistant.connect();

app.use('/api', assistant.getRouter());

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`🚀 AI Ticket Assistant dev server running on http://localhost:${port}`);
    });
}

export default app;

