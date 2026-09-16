import mongoose from 'mongoose';
import { BaseStorageAdapter } from './base.storage.js';
import { Agent } from '../models/agent.js';
import { Ticket } from '../models/ticket.js';

/**
 * MongoStorageAdapter
 * Concrete adapter implementing database operations using Mongoose / MongoDB.
 */
export class MongoStorageAdapter extends BaseStorageAdapter {
    /**
     * @param {Object} config - { mongoUri, connection }
     */
    constructor(config = {}) {
        super();
        this.mongoUri = config.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI;
        this.connection = config.connection || mongoose.connection;
    }

    async connect() {
        if (this.connection.readyState === 1) return; // Already connected
        const uri = this.mongoUri || process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MongoStorageAdapter requires mongoUri or an active mongoose connection");
        }
        await mongoose.connect(uri);
    }

    async disconnect() {
        if (this.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }

    // Mongoose auto-creates collections on first write — always ready
    async runMigrations() {
        console.log("MongoDB: Collections will be auto-created on first write.");
        return true;
    }

    // ==========================================
    // AGENT METHODS
    // ==========================================

    async createAgent(agentData) {
        const agent = await Agent.create(agentData);
        return agent.toObject();
    }

    async getAgentByEmail(email) {
        const agent = await Agent.findOne({ email });
        return agent ? agent.toObject() : null;
    }

    async getAgentById(id) {
        const agent = await Agent.findById(id);
        return agent ? agent.toObject() : null;
    }

    async getAgents(filter = {}) {
        const query = {};
        if (filter.email) query.email = filter.email;
        if (filter.skills) {
            query.skills = { $in: Array.isArray(filter.skills) ? filter.skills : [filter.skills] };
        }
        const agents = await Agent.find(query).sort({ createdAt: -1 });
        return agents.map(a => a.toObject());
    }

    async updateAgent(id, updates) {
        const agent = await Agent.findByIdAndUpdate(id, updates, { new: true });
        return agent ? agent.toObject() : null;
    }

    async deleteAgent(id) {
        const res = await Agent.findByIdAndDelete(id);
        return !!res;
    }

    // ==========================================
    // TICKET METHODS
    // ==========================================

    async createTicket(ticketData) {
        const ticket = await Ticket.create(ticketData);
        const populated = await Ticket.findById(ticket._id)
            .populate("assignedTo", ["email", "name", "skills"]);
        return populated ? populated.toObject() : ticket.toObject();
    }

    async getTicketById(id) {
        const ticket = await Ticket.findById(id)
            .populate("assignedTo", ["email", "name", "skills"]);
        if (!ticket) return null;
        return ticket.toObject();
    }

    async getTickets(filter = {}) {
        const query = {};

        if (filter.createdBy) {
            query.createdBy = filter.createdBy;
        }

        if (filter.assignedTo) {
            query.assignedTo = filter.assignedTo;
        }

        if (filter.status) {
            query.status = filter.status;
        }

        const tickets = await Ticket.find(query)
            .populate("assignedTo", ["email", "name", "skills"])
            .sort({ createdAt: -1 });

        return tickets.map(t => t.toObject());
    }

    async updateTicket(id, updates) {
        const ticket = await Ticket.findByIdAndUpdate(id, updates, { new: true })
            .populate("assignedTo", ["email", "name", "skills"]);
        if (!ticket) return null;
        return ticket.toObject();
    }

    async deleteTicket(id) {
        const res = await Ticket.findByIdAndDelete(id);
        return !!res;
    }
}

