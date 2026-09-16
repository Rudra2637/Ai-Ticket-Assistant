-- ==========================================================
-- TicketAI Supabase / PostgreSQL Schema
-- Run this in your Supabase SQL Editor to set up your tables
-- ==========================================================

-- 1. Create TicketAI Agents Table (Support Staff)
CREATE TABLE IF NOT EXISTS ticketai_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create TicketAI Tickets Table
CREATE TABLE IF NOT EXISTS ticketai_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_by TEXT,
    assigned_to UUID REFERENCES ticketai_agents(id) ON DELETE SET NULL,
    related_skills TEXT[] DEFAULT '{}',
    helpful_notes TEXT DEFAULT '',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for Fast Lookups
CREATE INDEX IF NOT EXISTS idx_ticketai_agents_email ON ticketai_agents(email);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_status ON ticketai_tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_assigned_to ON ticketai_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ticketai_tickets_created_by ON ticketai_tickets(created_by);

