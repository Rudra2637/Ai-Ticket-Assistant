import { sendMail } from "./mailer.js";
import analyzeTicket from "./ai.js";
import { storage } from "../storage/index.js";

export const onticketCreate = async (data) => {
    try {
        const ticketId = typeof data === 'string' ? data : (data?.ticketId || data?._id || data?.id);
        const ticket = await storage.getTicketById(ticketId);

        if (!ticket) {
            console.error(`[onTicketCreate] Ticket not found: ${ticketId}`);
            return { success: false };
        }

        // 1. Mark as TODO / in progress
        await storage.updateTicket(ticket._id || ticket.id, {
            status: "TODO"
        });

        // 2. AI Analysis
        const aiResponse = await analyzeTicket(ticket);
        let relatedSkills = [];
        let priority = "medium";
        let helpfulNotes = "";

        if (aiResponse) {
            priority = ["low", "medium", "high"].includes(aiResponse.priority?.toLowerCase())
                ? aiResponse.priority.toLowerCase()
                : "medium";
            helpfulNotes = aiResponse.helpfulNotes || aiResponse.helpfullNotes || "";
            relatedSkills = Array.isArray(aiResponse.relatedSkills) ? aiResponse.relatedSkills : [];

            await storage.updateTicket(ticket._id || ticket.id, {
                priority,
                helpfulNotes,
                relatedSkills,
                status: "In Progress"
            });
        }

        // 3. Match with Agents by skills
        const agents = await storage.getAgents();

        const assignedAgent = agents.find(agent =>
            Array.isArray(agent.skills) && agent.skills.some(skill =>
                relatedSkills.some(rs =>
                    skill.toLowerCase().includes(rs.toLowerCase()) ||
                    rs.toLowerCase().includes(skill.toLowerCase())
                )
            )
        ) || null;

        // 4. Update ticket assignment (null if no skill match -> manual triage)
        await storage.updateTicket(ticket._id || ticket.id, {
            assignedTo: assignedAgent ? (assignedAgent._id || assignedAgent.id) : null
        });

        // 5. Send Email if agent was matched
        if (assignedAgent?.email) {
            const subject = "Ticket Assigned to you";
            const text = `Hi ${assignedAgent.name || "Agent"},\n\nThis task "${ticket.title}" has been assigned to you. Please check your dashboard for more details.`;
            await sendMail(assignedAgent.email, subject, text);
        }

        return { success: true };

    } catch (error) {
        console.error("Error running on-ticket-create: ", error.message);
        return { success: false };
    }
};
