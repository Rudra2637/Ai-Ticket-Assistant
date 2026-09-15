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

    /**
     * Checks if ticketai_* tables exist in Supabase.
     * If not, prints the SQL to run manually in Supabase SQL Editor and returns false.
     */
    async runMigrations() {
        const { error } = await this.supabase
            .from('ticketai_agents')
            .select('id')
            .limit(1);

        if (!error) return true;

        const sql = `
-- TicketAI Framework Tables
-- Run this SQL in your Supabase SQL Editor (or psql)

CREATE TABLE IF NOT EXISTS ticketai_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticketai_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open',
    created_by TEXT,
    assigned_to UUID REFERENCES ticketai_agents(id) ON DELETE SET NULL,
    priority TEXT,
    deadline TIMESTAMPTZ,
    helpful_notes TEXT,
    related_skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
        `;
        console.log("\n📋 Run the following SQL in your Supabase database:\n");
        console.log(sql);
        return false;
    }

    // ==========================================
    // AGENT METHODS
    // ==========================================

    async createAgent(agentData) {
        const payload = {
            email: agentData.email,
            name: agentData.name || null,
            skills: Array.isArray(agentData.skills) ? agentData.skills : []
        };

        const { data, error } = await this.supabase
            .from('ticketai_agents')
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return this._formatAgent(data);
    }

    async getAgentByEmail(email) {
        const { data, error } = await this.supabase
            .from('ticketai_agents')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatAgent(data) : null;
    }

    async getAgentById(id) {
        const { data, error } = await this.supabase
            .from('ticketai_agents')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatAgent(data) : null;
    }

    async getAgents(filter = {}) {
        let query = this.supabase
            .from('ticketai_agents')
            .select('*')
            .order('created_at', { ascending: false });

        if (filter.email) {
            query = query.eq('email', filter.email);
        }
        if (filter.skills) {
            const skills = Array.isArray(filter.skills) ? filter.skills : [filter.skills];
            query = query.overlaps('skills', skills);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map(a => this._formatAgent(a));
    }

    async updateAgent(id, updates) {
        const payload = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.email !== undefined) payload.email = updates.email;
        if (updates.skills !== undefined) payload.skills = Array.isArray(updates.skills) ? updates.skills : [];

        const { data, error } = await this.supabase
            .from('ticketai_agents')
            .update(payload)
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatAgent(data) : null;
    }

    async deleteAgent(id) {
        const { data, error } = await this.supabase
            .from('ticketai_agents')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        return data && data.length > 0;
    }

    // ==========================================
    // TICKET METHODS
    // ==========================================

    async createTicket(ticketData) {
        const payload = {
            title: ticketData.title,
            description: ticketData.description,
            created_by: ticketData.createdBy || ticketData.created_by || null,
            status: ticketData.status || 'open',
            priority: ticketData.priority || 'medium',
            assigned_to: ticketData.assignedTo || ticketData.assigned_to || null,
            related_skills: ticketData.relatedSkills || ticketData.related_skills || [],
            helpful_notes: ticketData.helpfulNotes || ticketData.helpful_notes || '',
            deadline: ticketData.deadline || ticketData.deadLine || null
        };

        const { data, error } = await this.supabase
            .from('ticketai_tickets')
            .insert(payload)
            .select('*, assigned_to:ticketai_agents!assigned_to(id, email, name, skills)')
            .single();

        if (error) throw error;
        return this._formatTicket(data);
    }

    async getTicketById(id) {
        const { data, error } = await this.supabase
            .from('ticketai_tickets')
            .select('*, assigned_to:ticketai_agents!assigned_to(id, email, name, skills)')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatTicket(data) : null;
    }

    async getTickets(filter = {}) {
        let query = this.supabase
            .from('ticketai_tickets')
            .select('*, assigned_to:ticketai_agents!assigned_to(id, email, name, skills)')
            .order('created_at', { ascending: false });

        if (filter.createdBy || filter.created_by) {
            query = query.eq('created_by', filter.createdBy || filter.created_by);
        }

        if (filter.assignedTo || filter.assigned_to) {
            query = query.eq('assigned_to', filter.assignedTo || filter.assigned_to);
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
        if (updates.assignedTo !== undefined || updates.assigned_to !== undefined) {
            payload.assigned_to = updates.assignedTo !== undefined ? updates.assignedTo : updates.assigned_to;
        }
        if (updates.helpfulNotes !== undefined || updates.helpful_notes !== undefined) {
            payload.helpful_notes = updates.helpfulNotes || updates.helpful_notes;
        }
        if (updates.relatedSkills !== undefined || updates.related_skills !== undefined) {
            payload.related_skills = updates.relatedSkills || updates.related_skills;
        }
        if (updates.deadline !== undefined || updates.deadLine !== undefined) {
            payload.deadline = updates.deadline || updates.deadLine;
        }

        const { data, error } = await this.supabase
            .from('ticketai_tickets')
            .update(payload)
            .eq('id', id)
            .select('*, assigned_to:ticketai_agents!assigned_to(id, email, name, skills)')
            .maybeSingle();

        if (error) throw error;
        return data ? this._formatTicket(data) : null;
    }

    async deleteTicket(id) {
        const { error } = await this.supabase
            .from('ticketai_tickets')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    // ==========================================
    // FORMATTING HELPERS
    // ==========================================

    _formatAgent(agent) {
        if (!agent) return null;
        return {
            ...agent,
            _id: agent.id,
            id: agent.id
        };
    }

    _formatTicket(ticket) {
        if (!ticket) return null;
        const assignedAgent = ticket.assigned_to && typeof ticket.assigned_to === 'object'
            ? {
                _id: ticket.assigned_to.id,
                id: ticket.assigned_to.id,
                email: ticket.assigned_to.email,
                name: ticket.assigned_to.name,
                skills: ticket.assigned_to.skills || []
            }
            : (ticket.assigned_to || null);

        return {
            ...ticket,
            _id: ticket.id,
            id: ticket.id,
            createdBy: ticket.created_by,
            status: ticket.status || 'open',
            priority: ticket.priority,
            helpfulNotes: ticket.helpful_notes || '',
            relatedSkills: ticket.related_skills || [],
            deadline: ticket.deadline,
            assignedTo: assignedAgent,
            createdAt: ticket.created_at
        };
    }
}

