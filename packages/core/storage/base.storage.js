/**
 * BaseStorageAdapter
 * Abstract base class defining the contract that all database adapters
 * (MongoDB, Supabase, etc.) must implement.
 */
export class BaseStorageAdapter {
    async connect() {}
    async disconnect() {}
    async runMigrations() {}

    // ==========================================
    // AGENT METHODS
    // ==========================================

    async createAgent(agentData) {
        throw new Error("createAgent() must be implemented by storage adapter");
    }

    async getAgentByEmail(email) {
        throw new Error("getAgentByEmail() must be implemented by storage adapter");
    }

    async getAgentById(id) {
        throw new Error("getAgentById() must be implemented by storage adapter");
    }

    async getAgents(filter = {}) {
        throw new Error("getAgents() must be implemented by storage adapter");
    }

    async updateAgent(id, updates) {
        throw new Error("updateAgent() must be implemented by storage adapter");
    }

    async deleteAgent(id) {
        throw new Error("deleteAgent() must be implemented by storage adapter");
    }

    // ==========================================
    // TICKET METHODS
    // ==========================================

    async createTicket(ticketData) {
        throw new Error("createTicket() must be implemented by storage adapter");
    }

    async getTicketById(id) {
        throw new Error("getTicketById() must be implemented by storage adapter");
    }

    async getTickets(filter = {}) {
        throw new Error("getTickets() must be implemented by storage adapter");
    }

    async updateTicket(id, updates) {
        throw new Error("updateTicket() must be implemented by storage adapter");
    }

    async deleteTicket(id) {
        throw new Error("deleteTicket() must be implemented by storage adapter");
    }
}

