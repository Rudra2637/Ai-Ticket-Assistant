import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        default: "open"
    },
    createdBy: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketaiAgent",
        default: null
    },
    priority: String,
    deadline: Date,
    helpfulNotes: String,
    relatedSkills: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Ticket = mongoose.model("TicketaiTicket", ticketSchema, "ticketai_tickets");