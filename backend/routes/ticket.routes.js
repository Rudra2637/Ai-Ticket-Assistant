import express from 'express'

import { authmiddleWare } from '../middlewares/auth.js'
import { createTicket, getTicket, getTickets } from '../controllers/ticket.controller.js'

const router = express.Router()

router.get("/",authmiddleWare,getTickets)
router.get("/:id",authmiddleWare,getTicket)
router.post("/",authmiddleWare,createTicket)

export default router