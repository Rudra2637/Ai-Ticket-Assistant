import { BaseAIProvider } from './base.ai.js';

/**
 * Extracts and parses JSON from raw AI response text.
 * Strategy:
 * 1. Try JSON.parse directly first.
 * 2. Fall back to markdown code fence extraction (```json ... ```).
 * 3. Fall back to boundary brace extraction (first '{' to last '}').
 */
export function extractAndParseJSON(rawContent) {
    if (!rawContent || typeof rawContent !== 'string') {
        throw new Error('Empty or non-string AI response content');
    }

    const trimmed = rawContent.trim();

    // 1. Direct JSON.parse
    try {
        return JSON.parse(trimmed);
    } catch (_) {
        // Fall through to markdown code fence extraction
    }

    // 2. Fence extraction (```json ... ``` or ``` ... ```)
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenceMatch && fenceMatch[1]) {
        try {
            return JSON.parse(fenceMatch[1].trim());
        } catch (_) {
            // Fall through to brace extraction
        }
    }

    // 3. Brace extraction (first '{' to last '}')
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const braceContent = trimmed.slice(firstBrace, lastBrace + 1).trim();
        try {
            return JSON.parse(braceContent);
        } catch (braceErr) {
            throw new Error(`Failed to parse extracted JSON object: ${braceErr.message}`);
        }
    }

    throw new Error('No valid JSON structure found in AI response');
}

/**
 * Validates the parsed object against the triage schema and logs warnings when defaults are applied.
 */
export function validateAndNormalizeAIResponse(parsed, logger = console) {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Parsed response must be a non-null object');
    }

    const result = {};

    // 1. summary (string)
    if (typeof parsed.summary === 'string' && parsed.summary.trim()) {
        result.summary = parsed.summary.trim();
    } else {
        logger.warn('[Ticket Assistant AI] Warning: Field "summary" missing or invalid, defaulted to empty string.');
        result.summary = '';
    }

    // 2. priority ('low' | 'medium' | 'high')
    const rawPriority = String(parsed.priority || '').toLowerCase().trim();
    if (['high', 'urgent', 'critical', 'p0', 'p1', 'severe'].includes(rawPriority)) {
        result.priority = 'high';
        if (rawPriority !== 'high') {
            logger.warn(`[Ticket Assistant AI] Warning: Non-standard priority "${parsed.priority}" mapped to "high".`);
        }
    } else if (['low', 'minor', 'trivial', 'p3', 'p4'].includes(rawPriority)) {
        result.priority = 'low';
        if (rawPriority !== 'low') {
            logger.warn(`[Ticket Assistant AI] Warning: Non-standard priority "${parsed.priority}" mapped to "low".`);
        }
    } else if (rawPriority === 'medium' || rawPriority === 'p2' || rawPriority === 'normal') {
        result.priority = 'medium';
    } else {
        logger.warn(`[Ticket Assistant AI] Warning: Field "priority" missing or unrecognized ("${parsed.priority}"), defaulted to "medium".`);
        result.priority = 'medium';
    }

    // 3. helpfulNotes (string, accepts helpfulNotes, helpfullNotes, or notes)
    const rawNotes = parsed.helpfulNotes ?? parsed.helpfullNotes ?? parsed.notes;
    if (typeof rawNotes === 'string') {
        result.helpfulNotes = rawNotes.trim();
    } else {
        logger.warn('[Ticket Assistant AI] Warning: Field "helpfulNotes" missing or invalid, defaulted to empty string.');
        result.helpfulNotes = '';
    }

    // 4. relatedSkills (array of strings, coerces comma/newline-separated strings)
    const rawSkills = parsed.relatedSkills ?? parsed.skills;
    if (Array.isArray(rawSkills)) {
        result.relatedSkills = rawSkills
            .map(s => String(s).trim())
            .filter(Boolean);
    } else if (typeof rawSkills === 'string' && rawSkills.trim()) {
        logger.warn(`[Ticket Assistant AI] Warning: "relatedSkills" was returned as a string ("${rawSkills}"), coerced to array.`);
        result.relatedSkills = rawSkills
            .split(/[,;\n]+/)
            .map(s => s.trim())
            .filter(Boolean);
    } else {
        logger.warn('[Ticket Assistant AI] Warning: Field "relatedSkills" missing or invalid, defaulted to empty array [].');
        result.relatedSkills = [];
    }

    return result;
}

/**
 * Pure parsing + schema validation helper.
 */
export function parseAndValidateAIResponse(rawContent, logger = console) {
    const parsed = extractAndParseJSON(rawContent);
    return validateAndNormalizeAIResponse(parsed, logger);
}

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
     * Analyze ticket with active AI provider using standard fetch.
     * Retries once on failure.
     * @param {Object} ticket - { title: string, description: string }
     */
    async analyzeTicket(ticket) {
        if (!this.model) {
            console.warn("[Ticket Assistant AI] No AI model specified. Please specify 'model' in your config (e.g. { ai: { model: 'gemini-1.5-flash' } }) or set AI_MODEL in your .env. Skipping AI triage.");
            return null;
        }

        if (!this.baseUrl) {
            console.warn("[Ticket Assistant AI] No AI provider or baseUrl resolved. Please specify 'provider' (e.g. 'gemini', 'groq', 'openai') or 'baseUrl' in your config. Skipping AI triage.");
            return null;
        }

        if (!this.apiKey && !this.baseUrl.includes('localhost') && !this.baseUrl.includes('127.0.0.1')) {
            console.warn(`[Ticket Assistant AI] No API key found for provider "${this.provider}". Skipping AI triage.`);
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

        const endpoint = `${this.baseUrl.replace(/\/+$/, '')}/chat/completions`;

        const executeCall = async (includeJsonMode = true) => {
            const bodyPayload = {
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.1
            };

            if (includeJsonMode) {
                bodyPayload.response_format = { type: 'json_object' };
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(bodyPayload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`AI API error (${res.status}): ${errText}`);
            }

            const data = await res.json();
            const rawContent = data.choices?.[0]?.message?.content || '';
            return parseAndValidateAIResponse(rawContent);
        };

        // Attempt 1 with automatic retry on failure
        try {
            return await executeCall(true);
        } catch (firstError) {
            console.warn(`[Ticket Assistant AI] Triage attempt 1 failed: ${firstError.message}. Retrying once...`);
            try {
                // If the provider doesn't support response_format, fallback without it on retry
                const retryWithJsonMode = !firstError.message.includes('response_format');
                return await executeCall(retryWithJsonMode);
            } catch (retryError) {
                console.error(`[Ticket Assistant AI] Triage failed on retry: ${retryError.message}`);
                console.error(`[Ticket Assistant AI] Diagnostics -> Endpoint: ${this.baseUrl} | Model: ${this.model} | Provider: ${this.provider}`);
                return null;
            }
        }
    }
}
