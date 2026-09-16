import { storage } from "../storage/index.js";
import { onticketCreate } from "../utils/on-ticket-create.js";

export const createTicket = async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) return res.status(400).json({ error: "Please provide the required details" });

        const createdBy = (req.user?.id || req.user?._id)?.toString() || null;

        const createdTicket = await storage.createTicket({
            title,
            description,
            createdBy
        });
        
        onticketCreate({
            id: createdTicket.id || createdTicket._id,
            title,
            description
        }).catch(err => console.error("[onTicketCreate] Background error:", err));

        return res.status(201).json({
            message: "Ticket created Successfully",
            ticket: createdTicket
        });
    } catch (error) {
        console.error("Error in creating the ticket ", error.message);
        return res.status(500).json({ error: "Error in creating the ticket" });
    }
};

export const getTickets = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
        if (req.query.createdBy) filter.createdBy = req.query.createdBy;

        const tickets = await storage.getTickets(filter);
        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Error in getting all tickets ", error.message);
        return res.status(500).json({ error: "Error in getting all tickets" });
    }
};

export const getTicket = async (req, res) => {
    try {
        const ticket = await storage.getTicketById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket does not exist" });
        }
        return res.status(200).json(ticket);
    } catch (error) {
        console.error("Error in getting the ticket ", error.message);
        return res.status(500).json({ error: "Error in getting ticket" });
    }
};

export const updateTicket = async (req, res) => {
    try {
        const { status, assignedTo, priority } = req.body;

        // If assignedTo is provided, validate that the agent exists
        if (assignedTo) {
            const agent = await storage.getAgentById(assignedTo);
            if (!agent) {
                return res.status(400).json({ error: "Invalid assignedTo: Agent does not exist" });
            }
        }

        const ticket = await storage.updateTicket(req.params.id, {
            ...(status && { status }),
            ...(assignedTo !== undefined && { assignedTo }),
            ...(priority && { priority })
        });
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        return res.json({ message: "Ticket updated", ticket });
    } catch (error) {
        console.error("Error updating ticket:", error.message);
        return res.status(500).json({ error: "Error updating ticket" });
    }
};
