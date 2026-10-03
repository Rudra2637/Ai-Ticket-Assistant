import { BaseAIProvider } from './base.ai.js';

/**
 * DefaultAIProvider
 * Built-in standard AI provider using native fetch.
 * Compatible with any OpenAI-compatible API (Groq, OpenAI, Ollama, DeepSeek, Together AI, OpenRouter, etc.).
 * Zero external dependencies!
 */
export class DefaultAIProvider extends BaseAIProvider {
    /**
     * @param {Object} config - { apiKey, model, baseUrl, provider }
     */
    constructor(config = {}) {
        super();

        const PROVIDERS = {
            gemini: {
                baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/'
            },
            groq: {
                baseUrl: 'https://api.groq.com/openai/v1'
            },
            openai: {
                baseUrl: 'https://api.openai.com/v1'
            },
            deepseek: {
                baseUrl: 'https://api.deepseek.com/v1'
            },
            ollama: {
                baseUrl: 'http://localhost:11434/v1'
            },
            openrouter: {
                baseUrl: 'https://openrouter.ai/api/v1'
            }
        };

        // 1. Detect Provider (explicit config -> env provider -> named env key)
        let provider = (config.provider || process.env.AI_PROVIDER || '').toLowerCase();
        
        if (!provider) {
            if (process.env.GEMINI_API_KEY) {
                provider = 'gemini';
            } else if (process.env.GROQ_API_KEY) {
                provider = 'groq';
            } else if (process.env.OPENAI_API_KEY) {
                provider = 'openai';
            } else if (process.env.DEEPSEEK_API_KEY) {
                provider = 'deepseek';
            }
        }

        const providerInfo = PROVIDERS[provider] || {};

        // 2. Resolve API Key
        this.apiKey = config.apiKey || 
            process.env.AI_API_KEY || 
            (provider === 'gemini' ? process.env.GEMINI_API_KEY : null) ||
            (provider === 'groq' ? process.env.GROQ_API_KEY : null) ||
            (provider === 'openai' ? process.env.OPENAI_API_KEY : null) ||
            (provider === 'deepseek' ? process.env.DEEPSEEK_API_KEY : null) ||
            process.env.GEMINI_API_KEY ||
            process.env.GROQ_API_KEY ||
            process.env.OPENAI_API_KEY ||
            process.env.DEEPSEEK_API_KEY ||
            null;

        // 3. Resolve Base URL
        this.baseUrl = config.baseUrl || 
            process.env.AI_BASE_URL || 
            providerInfo.baseUrl || 
            null;

        // 4. Resolve Model (Strictly user-configured: no hardcoded assumptions!)
        this.model = config.model || process.env.AI_MODEL || null;
        
        this.provider = provider || 'custom';
    }

    /**
     * Analyze ticket with active AI provider using standard fetch
     * @param {Object} ticket - { title: string, description: string }
     */
    async analyzeTicket(ticket) {
        if (!this.model) {
            console.warn("[OpenDesk AI] No AI model specified. Please specify 'model' in your config (e.g. { ai: { model: 'gemini-1.5-flash' } }) or set AI_MODEL in your .env. Skipping AI triage.");
            return null;
        }

        if (!this.baseUrl) {
            console.warn("[OpenDesk AI] No AI provider or baseUrl resolved. Please specify 'provider' (e.g. 'gemini', 'groq', 'openai') or 'baseUrl' in your config. Skipping AI triage.");
            return null;
        }

        if (!this.apiKey && !this.baseUrl.includes('localhost') && !this.baseUrl.includes('127.0.0.1')) {
            console.warn(`[OpenDesk AI] No API key found for provider "${this.provider}". Skipping AI triage.`);
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
            console.error(`[OpenDesk AI] Triage failed: ${error.message}`);
            console.error(`[OpenDesk AI] Diagnostics -> Endpoint: ${this.baseUrl} | Model: ${this.model} | Provider: ${this.provider}`);
            return null;
        }
    }
}

