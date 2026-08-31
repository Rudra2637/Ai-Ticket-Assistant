/**
 * BaseStorageAdapter
 * Abstract base class defining the contract that all database adapters
 * (MongoDB, Supabase, etc.) must implement.
 */
export class BaseStorageAdapter {
    async connect() {}
    async disconnect() {}

    // ==========================================
    // USER & MODERATOR METHODS
    // ==========================================

    async createUser(userData) {
        throw new Error("createUser() must be implemented by storage adapter");
    }

    async getUserByEmail(email) {
        throw new Error("getUserByEmail() must be implemented by storage adapter");
    }

    async getUserById(id) {
        throw new Error("getUserById() must be implemented by storage adapter");
    }

    async getUsers(filter = {}) {
        throw new Error("getUsers() must be implemented by storage adapter");
    }

    async getUsersByRole(role) {
        throw new Error("getUsersByRole() must be implemented by storage adapter");
    }

    async updateUser(id, updates) {
        throw new Error("updateUser() must be implemented by storage adapter");
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
