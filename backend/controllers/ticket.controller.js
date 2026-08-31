import { inngest } from "../inngest/client.js";
import { storage } from "../storage/index.js";

export const createTicket = async (req, res) => {
    const { title, description } = req.body
    try {
        if (!title || !description) return res.status(400).json({ error: "Please provide the required details" });

        const createdTicket = await storage.createTicket({
            title,
            description,
            createdBy: req.user?._id.toString()
        })

        // Inngest Call
        await inngest.send({
            name: "ticket/created",
            data: {
                ticketId: (createdTicket._id || createdTicket.id).toString(),
                title,
                description,
                createdBy: req.user._id.toString()
            }
        })

        return res.status(201).json({
            message: "Ticket created Successfully",
            ticket: createdTicket
        })

    } catch (error) {
        console.error("Error in creating ticket ", error.message)
        return res.status(500).json({ error: "Error in creating ticket " })
    }
}

export const getTickets = async (req, res) => {
    try {
        const user = req.user
        let tickets = []

        if (user.role === "admin") {
            // Admins can see all tickets
            tickets = await storage.getTickets({})
        }
        else if (user.role === "moderator") {
            // Moderators can only see tickets assigned to them
            tickets = await storage.getTickets({ assignedTo: user._id })
        }
        else {
            // Users can only see tickets created by them
            tickets = await storage.getTickets({ createdBy: user._id })
        }
        return res.status(200).json(tickets)
    } catch (error) {
        console.error("Error in getting all tickets ", error.message)
        return res.status(500).json({ error: "Error in getting all tickets" })
    }
}

export const getTicket = async (req, res) => {
    try {
        const user = req.user
        const ticket = await storage.getTicketById(req.params.id)

        if (!ticket) {
            return res.status(404).json({ message: "Ticket does not exist" })
        }

        // Access control
        if (user.role === "moderator") {
            const assignedId = ticket.assisgnedTo?._id || ticket.assisgnedTo?.id || ticket.assisgnedTo;
            if (assignedId?.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
        } else if (user.role === "user") {
            const creatorId = ticket.createdBy?._id || ticket.createdBy?.id || ticket.createdBy;
            if (creatorId?.toString() !== user._id.toString()) {
                return res.status(403).json({ message: "Access denied" });
            }
        }

        return res.status(200).json(ticket);

    } catch (error) {
        console.error("Error in getting the ticket ", error.message)
        return res.status(500).json({ error: "Error in getting ticket" })
    }
}
