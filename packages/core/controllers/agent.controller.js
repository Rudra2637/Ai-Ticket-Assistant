import { storage } from '../storage/index.js'


export const createAgents  = async (req,res) => {
    const { email, name, skills = [] } = req.body
    try {
        if (!email) return res.status(400).json({ error: "Email is required" });

        const existing = await storage.getAgentByEmail(email);
        if (existing) return res.status(409).json({ error: "Agent already exists" });

        const agent = await storage.createAgent({ email, name, skills });

        return res.status(201).json({ message: "Agent created", agent });
    } catch (error) {
        console.error("Error in creating user", error)
        return res.status(500).json({message: "Error in creating agent"})
    }
} 


export const updateAgent = async (req, res) => {
    try {
        const agent = await storage.updateAgent(req.params.id, req.body);
        if (!agent) return res.status(404).json({ error: "Agent not found" });
        return res.json({ message: "Agent updated", agent });
    } catch (error) {
        return res.status(500).json({ error: "Error updating agent", details: error.message });
    }
};

export const getAgents = async (req, res) => {
    try {
        const agents = await storage.getAgents();
        return res.json({ agents });
    } catch (error) {
        return res.status(500).json({ error: "Error fetching agents" });
    }
};

export const deleteAgent = async (req,res) => {
    try {
        const deleted = await storage.deleteAgent(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Agent not found" });
        return res.json({ message: "Agent deleted" });
    } catch (error) {
        console.error("Error in deleting the agent" , error)
        return res.status(500).json({message : "Error occured in deleting the user"})
    }
}