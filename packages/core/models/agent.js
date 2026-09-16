import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    skills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Agent = mongoose.model("TicketaiAgent", agentSchema, "ticketai_agents");