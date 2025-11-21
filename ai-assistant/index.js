import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import {serve} from 'inngest/express'
import userRoutes from './routes/user.routes.js'
import ticketRoutes from './routes/ticket.routes.js'
import { inngest } from './inngest/client.js'
import { onUserSignUp } from './inngest/functions/on-userSignup.js'
import { onticketCreate } from './inngest/functions/on-ticket-create.js'

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth",userRoutes)
app.use("/api/ticket",ticketRoutes)
app.use("/api/inngest",serve({
    client:inngest,
    functions:[onUserSignUp,onticketCreate]
}))

mongoose.connect(process.env.MONGODB_URI)
.then(
    app.listen(port,() => console.log(`Server is Live on port ${port}`))
)
.catch((err) => console.log("Mongo Db connnection error: ",err))