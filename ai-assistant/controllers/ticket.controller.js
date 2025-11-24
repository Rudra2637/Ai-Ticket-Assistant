import { inngest } from "../inngest/client.js";
import { Ticket } from "../models/ticket.js";

export const createTicket = async (req,res) => {
    const {title,description} = req.body
    // console.log("Create Ticket request: ",req.body)
    try {
        if(!title || !description) return res.status(401).json({error:"Please provide the required details"});
        const createTicket = await Ticket.create({
            title,
            description,
            createdBy:req.user?._id.toString()
        })

        //Inngest Call
        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId:createTicket._id.toString(),
                title,
                description,
                createdBy:req.user._id.toString()
            }
        })

        return res.status(201).json({
            message:"Ticket created Successfully",
            ticket:createTicket
        })

    } catch (error) {
        console.error("Error in creating ticket ",error.message)
        return res.status(500).json({error:"Error in creating ticket "})
    }
}

export const getTickets = async (req,res) => {
    try {
        const user = req.user
        let tickets = []
        if(user.role !== "user"){
            tickets = await Ticket.find({})
            .populate("assisgnedTo",["email","_id"])
            .sort({createdAt:-1})
        }
        else{
            tickets = await Ticket.find({createdBy:user._id}).select("title description status createdAt",)
            .sort({createdAt:-1})
        }
        return res.status(200).json(tickets)
    } catch (error) {
        console.error("Error in getting all tickets ",error.message)
        return res.status(500).json({error:"Error in getting all tickets"})
    }
}

export const getTicket = async (req,res) => {
    try {
        const user = req.user
        let ticket;
        if(user.role !== "user"){
            ticket = await Ticket.findById(req.params.id).populate("assisgnedTo",["email","_id"])
        }
        else{
            ticket = await Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id
            }).select("title description status createdAt")
        }
        if(!ticket){
            return res.status(404).json({message:"Ticket does not exist"})
        }

        return res.status(200).json(ticket);

    } catch (error) {
        console.error("Error in getting the ticket ",error.message)
        return res.status(500).json({error:"Error in getting ticket"})
    }
}