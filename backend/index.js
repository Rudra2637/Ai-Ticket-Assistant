import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { serve } from 'inngest/express'
import userRoutes from './routes/user.routes.js'
import ticketRoutes from './routes/ticket.routes.js'
import { inngest } from './inngest/client.js'
import { onUserSignUp } from './inngest/functions/on-userSignup.js'
import { onticketCreate } from './inngest/functions/on-ticket-create.js'
import { storage } from './storage/index.js'

const port = process.env.PORT || 3000
const app = express()

app.get("/", (_req, res) => {
  res.send("AI Assistant Backend is running!");
});

app.use(cors())
app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/tickets", ticketRoutes)
app.use("/api/inngest", serve({
    client: inngest,
    functions: [onUserSignUp, onticketCreate]
}))

try {
    if (typeof storage.connect === 'function') {
        await storage.connect();
    }
    app.listen(port, () => {
        const providerName = process.env.STORAGE_PROVIDER || (process.env.SUPABASE_URL ? 'Supabase' : 'MongoDB');
        console.log(`Database connected (${providerName}) | Server is Live on port ${port}`);
    });
} catch (err) {
    console.error("Database connection error: ", err);
}