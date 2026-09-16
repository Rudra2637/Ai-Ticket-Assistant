import express from 'express';
import { createTicket, getTicket, getTickets, updateTicket } from '../controllers/ticket.controller.js';

export function createTicketRouter(auth = {}) {
    const router = express.Router();

    // Tier 1: Customer auth (create/read tickets)
    const customerAuth = auth.middleware || ((req, res, next) => next());

    // Tier 2: Agent/staff auth (update status, triage / reassign)
    const agentAuth = auth.agentMiddleware || auth.adminMiddleware || customerAuth;

    router.get("/", customerAuth, getTickets);
    router.get("/:id", customerAuth, getTicket);
    router.post("/", customerAuth, createTicket);
    router.patch("/:id", agentAuth, updateTicket);

    return router;
}

export default createTicketRouter;