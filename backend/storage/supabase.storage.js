import { createClient } from '@supabase/supabase-js';
import { BaseStorageAdapter } from './base.storage.js';

/**
 * SupabaseStorageAdapter
 * Concrete adapter implementing database operations using Supabase (PostgreSQL).
 */
export class SupabaseStorageAdapter extends BaseStorageAdapter {
    /**
     * @param {Object} config - { supabaseUrl, supabaseKey } or { supabaseClient }
     */
    constructor(config = {}) {
        super();
        if (config.supabaseClient) {
            this.supabase = config.supabaseClient;
        } else {
            const url = config.supabaseUrl || process.env.SUPABASE_URL;
            const key = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
            if (!url || !key) {
                throw new Error("SupabaseStorageAdapter requires supabaseUrl and supabaseKey");
            }
            this.supabase = createClient(url, key);
        }
    }

    // ==========================================
    // USER METHODS
    // ==========================================

    async createUser(userData) {
        const payload = {
            email: userData.email,
            password: userData.password,
            role: userData.role || 'user',
            skills: Array.isArray(userData.skills) ? userData.skills : []
        };

        const { data, error } = await this.supabase
            .from('users')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return this._formatUser(data);
    }

    async getUserByEmail(email) {
        const { data, error } = await this.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatUser(data) : null;
    }

    async getUserById(id) {
        const { data, error } = await this.supabase
            .from('users')
            .select('id, email, role, skills, created_at')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatUser(data) : null;
    }

    async getUsers(filter = {}) {
        let query = this.supabase
            .from('users')
            .select('id, email, role, skills, created_at')
            .order('created_at', { ascending: false });

        if (filter.role) {
            query = query.eq('role', filter.role);
        }
        if (filter.email) {
            query = query.eq('email', filter.email);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map(u => this._formatUser(u));
    }

    async getUsersByRole(role) {
        return this.getUsers({ role });
    }

    async updateUser(id, updates) {
        const payload = {};
        if (updates.role !== undefined) payload.role = updates.role;
        if (updates.skills !== undefined) payload.skills = updates.skills;
        if (updates.email !== undefined) payload.email = updates.email;

        const { data, error } = await this.supabase
            .from('users')
            .update(payload)
            .eq('id', id)
            .select('id, email, role, skills, created_at')
            .single();

        if (error) throw error;
        return this._formatUser(data);
    }

    // ==========================================
    // TICKET METHODS
    // ==========================================

    async createTicket(ticketData) {
        const payload = {
            title: ticketData.title,
            description: ticketData.description,
            created_by: ticketData.createdBy || ticketData.created_by,
            status: ticketData.status || 'In Progress',
            priority: ticketData.priority || 'medium',
            assigned_to: ticketData.assignedTo || ticketData.assisgnedTo || ticketData.assigned_to || null,
            related_skills: ticketData.relatedSkills || ticketData.related_skills || [],
            helpful_notes: ticketData.helpfulNotes || ticketData.helpfullNotes || ticketData.helpful_notes || '',
            deadline: ticketData.deadLine || ticketData.deadline || null
        };

        const { data, error } = await this.supabase
            .from('tickets')
            .insert(payload)
            .select('*, assigned_to_user:users!assigned_to(id, email)')
            .single();

        if (error) throw error;
        return this._formatTicket(data);
    }

    async getTicketById(id) {
        const { data, error } = await this.supabase
            .from('tickets')
            .select('*, assigned_to_user:users!assigned_to(id, email)')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatTicket(data) : null;
    }

    async getTickets(filter = {}) {
        let query = this.supabase
            .from('tickets')
            .select('*, assigned_to_user:users!assigned_to(id, email)')
            .order('created_at', { ascending: false });

        if (filter.createdBy || filter.created_by) {
            query = query.eq('created_by', filter.createdBy || filter.created_by);
        }

        if (filter.assignedTo || filter.assisgnedTo || filter.assigned_to) {
            query = query.eq('assigned_to', filter.assignedTo || filter.assisgnedTo || filter.assigned_to);
        }

        if (filter.status) {
            query = query.eq('status', filter.status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map(t => this._formatTicket(t));
    }

    async updateTicket(id, updates) {
        const payload = {};
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.priority !== undefined) payload.priority = updates.priority;
        if (updates.assignedTo !== undefined || updates.assisgnedTo !== undefined || updates.assigned_to !== undefined) {
            payload.assigned_to = updates.assignedTo || updates.assisgnedTo || updates.assigned_to;
        }
        if (updates.helpfulNotes !== undefined || updates.helpfullNotes !== undefined) {
            payload.helpful_notes = updates.helpfulNotes || updates.helpfullNotes;
        }
        if (updates.relatedSkills !== undefined || updates.related_skills !== undefined) {
            payload.related_skills = updates.relatedSkills || updates.related_skills;
        }
        if (updates.deadLine !== undefined || updates.deadline !== undefined) {
            payload.deadline = updates.deadLine || updates.deadline;
        }

        const { data, error } = await this.supabase
            .from('tickets')
            .update(payload)
            .eq('id', id)
            .select('*, assigned_to_user:users!assigned_to(id, email)')
            .single();

        if (error) throw error;
        return this._formatTicket(data);
    }

    async deleteTicket(id) {
        const { error } = await this.supabase
            .from('tickets')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // ==========================================
    // FORMATTING HELPERS
    // ==========================================

    _formatUser(user) {
        if (!user) return null;
        return {
            ...user,
            _id: user.id,
            id: user.id
        };
    }

    _formatTicket(ticket) {
        if (!ticket) return null;
        const formatted = {
            ...ticket,
            _id: ticket.id,
            id: ticket.id,
            createdBy: ticket.created_by,
            relatedSkills: ticket.related_skills || [],
            helpfullNotes: ticket.helpful_notes || '',
            deadLine: ticket.deadline,
            // Format populated moderator data matching MongoDB's assisgnedTo structure
            assisgnedTo: ticket.assigned_to_user ? {
                _id: ticket.assigned_to_user.id,
                id: ticket.assigned_to_user.id,
                email: ticket.assigned_to_user.email
            } : (ticket.assigned_to || null)
        };
        return formatted;
    }
}
