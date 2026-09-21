import { BaseAIProvider } from './base.ai.js';

/**
 * DefaultAIProvider
 * Built-in standard AI provider using native fetch.
 * Compatible with any OpenAI-compatible API (Groq, OpenAI, Ollama, DeepSeek, Together AI, OpenRouter, etc.).
 * Zero external dependencies!
 */
export class DefaultAIProvider extends BaseAIProvider {
    /**
     * @param {Object} config - { apiKey, model, baseUrl }
     */
    constructor(config = {}) {
        super();
        this.apiKey = config.apiKey || process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        this.model = config.model || process.env.AI_MODEL || 'llama-3.3-70b-versatile';
        this.baseUrl = config.baseUrl || process.env.AI_BASE_URL || (process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1');
    }

    /**
     * Analyze ticket with active AI provider using standard fetch
     * @param {Object} ticket - { title: string, description: string }
     */
    async analyzeTicket(ticket) {
        if (!this.apiKey && !this.baseUrl.includes('localhost') && !this.baseUrl.includes('127.0.0.1')) {
            console.warn("DefaultAIProvider: No AI API key found. Skipping AI triage.");
            return null;
        }

        const systemPrompt = `You are an expert AI assistant that processes technical support tickets. 
Your job is to:
1. Summarize the issue.
2. Estimate its priority: "low", "medium", or "high".
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

Respond ONLY with a valid raw JSON object matching this structure:
{
  "summary": "Short 1-2 sentence summary of the ticket",
  "priority": "high",
  "helpfulNotes": "Technical explanation, troubleshooting steps, and useful links...",
  "relatedSkills": ["React", "Node.js"]
}

Do NOT wrap in markdown, backticks, or code blocks. Return ONLY raw JSON.`;

        const userPrompt = `Ticket Information:
- Title: ${ticket.title}
- Description: ${ticket.description}`;

        try {
            const endpoint = `${this.baseUrl.replace(/\/+$/, '')}/chat/completions`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.2
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`AI API error (${res.status}): ${errText}`);
            }

            const data = await res.json();
            const rawContent = data.choices?.[0]?.message?.content || '';

            // Extract JSON even if wrapped in markdown code blocks
            const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
            const jsonString = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();

            const parsed = JSON.parse(jsonString);

            return {
                summary: parsed.summary || '',
                priority: parsed.priority || 'medium',
                helpfulNotes: parsed.helpfulNotes || parsed.helpfullNotes || '',
                relatedSkills: Array.isArray(parsed.relatedSkills) ? parsed.relatedSkills : []
            };
        } catch (error) {
            console.error("[DefaultAIProvider] AI triage failed: " + error.message);
            return null;
        }
    }
}

