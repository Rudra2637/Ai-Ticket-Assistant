import express from 'express';
import { createAgents, getAgents, updateAgent, deleteAgent } from '../controllers/agent.controller.js';

const router = express.Router();

router.post("/", createAgents);
router.get("/", getAgents);
router.patch("/:id", updateAgent);
router.delete("/:id", deleteAgent);

export default router;