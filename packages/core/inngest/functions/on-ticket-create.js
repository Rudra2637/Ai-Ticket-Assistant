import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import analyzeTicket from "../../utils/ai.js";
import { storage } from "../../storage/index.js";

export const onticketCreate = inngest.createFunction(
    { id: "on-ticket-created", retries: 2 },
    { event: "ticket/created" },
    async ({ event, step }) => {
        try {
            const { ticketId } = event.data;

            const ticket = await step.run("fetch-ticket", async () => {
                const fetchTicket = await storage.getTicketById(ticketId);
                if (!fetchTicket) throw new NonRetriableError("Ticket not found");
                return fetchTicket;
            });

            await step.run("update-ticket", async () => {
                await storage.updateTicket(ticket._id || ticket.id, {
                    status: "TODO"
                });
            });

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("ai-processing", async () => {
                let skills = [];
                if (aiResponse) {
                    const priority = !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority;
                    await storage.updateTicket(ticket._id || ticket.id, {
                        priority,
                        helpfullNotes: aiResponse.helpfullNotes,
                        relatedSkills: aiResponse.relatedSkills,
                        status: "In Progress",
                    });
                    skills = aiResponse.relatedSkills || [];
                }
                return skills;
            });

            const moderator = await step.run("assign-moderator", async () => {
                const moderators = await storage.getUsers({ role: "moderator" });

                // Database-agnostic skill matching: find moderator with matching skill
                let user = moderators.find(mod =>
                    Array.isArray(mod.skills) && mod.skills.some(skill =>
                        relatedSkills.some(rs =>
                            skill.toLowerCase().includes(rs.toLowerCase()) ||
                            rs.toLowerCase().includes(skill.toLowerCase())
                        )
                    )
                );

                // Fallback to first available admin if no moderator matches skills
                if (!user) {
                    const admins = await storage.getUsers({ role: "admin" });
                    user = admins[0] || null;
                }

                await storage.updateTicket(ticket._id || ticket.id, {
                    assignedTo: user?._id || user?.id || null
                });

                return user;
            });

            await step.run("send-taskAssigned-email", async () => {
                if (moderator && moderator.email) {
                    const to = moderator.email;
                    const subject = "Ticket Assigned to you";
                    const text = `Hi\n\nThis task "${ticket.title}" is assigned to you. Please check your dashboard for more details.`;
                    await sendMail(to, subject, text);
                }
            });

            return { success: true };

        } catch (error) {
            console.error("Error running the on-ticket-create function: ", error.message);
            return { success: false };
        }
    }
);