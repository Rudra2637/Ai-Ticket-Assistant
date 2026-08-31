import { createAgent, openai } from '@inngest/agent-kit';
import { BaseAIProvider } from './base.ai.js';

/**
 * DefaultAIProvider
 * Built-in standard AI provider compatible with any OpenAI-compatible API
 * (Groq, OpenAI, Ollama, DeepSeek, Together AI, OpenRouter, etc.).
 */
export class DefaultAIProvider extends BaseAIProvider {
    /**
     * @param {Object} config - { apiKey, model, baseUrl }
     */
    constructor(config = {}) {
        super();
        this.apiKey = config.apiKey || process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
        this.model = config.model || process.env.AI_MODEL || 'llama-3.3-70b-versatile';
        this.baseUrl = config.baseUrl || process.env.AI_BASE_URL || (process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1');
    }

    /**
     * Analyze ticket with active AI provider
     * @param {Object} ticket - { title: string, description: string }
     */
    async analyzeTicket(ticket) {
        if (!this.apiKey && !this.baseUrl.includes('localhost') && !this.baseUrl.includes('127.0.0.1')) {
            console.warn("DefaultAIProvider: No AI API key found. Skipping AI triage.");
            return null;
        }

        const supportAgent = createAgent({
            model: openai({
                model: this.model,
                apiKey: this.apiKey || 'ollama',
                baseUrl: this.baseUrl
            }),
            name: 'Ai Ticket Triage Assistant',
            system: `You are an expert AI assistant that processes technical support tickets. 
                Your job is to:
                1. Summarize the issue.
                2. Estimate its priority.
                3. Provide helpful notes and resource links for human moderators.
                4. List relevant technical skills required.

                IMPORTANT:
                - Respond with *only* valid raw JSON.
                - Do NOT include markdown, code fences, comments, or any extra formatting.`
        });

        const prompt = `You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
            
        Analyze the following support ticket and provide a JSON object with:
        - summary: A short 1-2 sentence summary of the issue.
        - priority: One of "low", "medium", or "high".
        - helpfullNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
        - relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

        Respond ONLY in this JSON format:
        {
          "summary": "Short summary of the ticket",
          "priority": "high",
          "helpfullNotes": "Here are useful tips...",
          "relatedSkills": ["React", "Node.js"]
        }

        ---
        Ticket information:
        - Title: ${ticket.title}
        - Description: ${ticket.description}`;

        try {
            const response = await supportAgent.run(prompt);
            const raw = response.output[0]?.content || '';
            const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
            const jsonString = match ? match[1] : raw.trim();
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("DefaultAIProvider: Failed to parse AI response: " + error.message);
            return null;
        }
    }
}
