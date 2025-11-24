import { inngest } from "../client.js";
import { NonRetriableError } from "inngest";
import { sendMail } from "../../utils/mailer.js";
import { Ticket } from "../../models/ticket.js";
import analyzeTicket from "../../utils/ai.js";
import { User } from "../../models/user.js";


export const onticketCreate = inngest.createFunction(
    {id:"on-ticket-created",retries:2},
    {event:"ticket/created"},
    async ({event,step}) => {
        try {
            const {ticketId} = event.data
            const ticket = await step.run("fetch-ticket",async () => {
                const fetchTicket = await Ticket.findById(ticketId)
                if(!fetchTicket) throw new NonRetriableError("Ticket not found");
                return fetchTicket
            })

            await step.run("update-ticket",async () => {
                const updateTicket = await Ticket.findByIdAndUpdate(ticket._id,{
                    status:"TODO"
                })
            })

            const aiResponse = await analyzeTicket(ticket)

            const relatedSkills = await step.run("ai-processing",async () => {
                let skills = []
                if(aiResponse){
                    // console.log("Ai response: ",aiResponse)
                    // console.log("Help full Notes: ",aiResponse.helpfullNotes)
                    const updateTicket = await Ticket.findByIdAndUpdate(ticket._id,{
                        priority: !["low","medium","high"].includes(aiResponse.priority) ? "medium":aiResponse.priority,
                        helpfullNotes:aiResponse.helpfullNotes,
                        relatedSkills:aiResponse.relatedSkills,
                        status:"In Progress",
                    })
                    skills = aiResponse.relatedSkills
                }
                return skills
            })

            const moderator = await step.run("assign-moderator",async () => {
                let user = await User.findOne({
                    role:"moderator",
                    skills:{
                        $elemMatch:{
                            $regex:relatedSkills.join("|"),
                            $options:"i",
                        },
                    },
                })
                console.log("User found for moderation: ",user)
                if(!user){
                    user = await User.findOne({
                        role:"admin"
                    })
                }
                await Ticket.findByIdAndUpdate(ticket._id,{
                    assisgnedTo:user?._id || null
                })
                return user
            });

            await step.run("send-taskAssigned-email",async () => {
                if(moderator) {
                    const to = moderator.email
                    const subject = "Ticket Assigned to you"
                    const text = `Hi
                        \n\n
                        This task ${ticket.title} is assigned to you, please check your dashboard for more details.
                        `   
                    await sendMail(to,subject,text)        // Check here if something goes wrong
                } 
            })

            return {success:true}

        } catch (error) {
            console.error("Error running the on-ticket-create function: ",error.message)
            return ({success:false})
        }
    }
)