import mongoose from 'mongoose';
import { BaseStorageAdapter } from './base.storage.js';
import { User } from '../models/user.js';
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

    // ==========================================
    // USER METHODS
    // ==========================================

    async createUser(userData) {
        const user = await User.create(userData);
        return user.toObject();
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email })
        if (!user) return null;
        return user.toObject()
    }

    async getUserById(id) {
        const user = await User.findById(id).select("-password");
        if (!user) return null;
        return user.toObject();
    }

    async getUsers(filter = {}) {
        const query = {};
        if (filter.role) {
            query.role = filter.role;
        }
        if (filter.email) {
            query.email = filter.email;
        }
        const users = await User.find(query).select("-password").sort({ createdAt: -1 });
        return users.map(u => u.toObject());
    }

    async getUsersByRole(role) {
        return this.getUsers({ role });
    }

    async updateUser(id, updates) {
        const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
        if (!user) return null;
        return user.toObject();
    }

    async createTicket(ticketData) {
        const ticket = await Ticket.create(ticketData);
        const populated = await Ticket.findById(ticket._id).populate("assisgnedTo", ["email", "_id"]);
        return populated ? populated.toObject() : ticket.toObject();
    }

    async getTicketById(id) {
        const ticket = await Ticket.findById(id).populate("assisgnedTo", ["email", "_id"]);
        if (!ticket) return null;
        return ticket.toObject();
    }

    async getTickets(filter = {}) {
        const query = {};

        if (filter.createdBy) {
            query.createdBy = filter.createdBy;
        }

        if (filter.assignedTo || filter.assisgnedTo) {
            query.assisgnedTo = filter.assignedTo || filter.assisgnedTo;
        }

        if (filter.status) {
            query.status = filter.status;
        }

        const tickets = await Ticket.find(query)
            .populate("assisgnedTo", ["email", "_id"])
            .sort({ createdAt: -1 });

        return tickets.map(t => t.toObject());
    }

    async updateTicket(id, updates) {
        const ticket = await Ticket.findByIdAndUpdate(id, updates, { new: true })
            .populate("assisgnedTo", ["email", "_id"]);
        if (!ticket) return null;
        return ticket.toObject();
    }

    async deleteTicket(id) {
        const res = await Ticket.findByIdAndDelete(id);
        return !!res;
    }
}
