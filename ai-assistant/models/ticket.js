import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title:String,
    description:String,
    status:{
        type:Stirng,
        default:"In Progress"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    assisgnedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    priority:String,
    deadLine:Date,
    helpfullNotes:String,
    relatedSkills:[String],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("Ticket",ticketSchema)