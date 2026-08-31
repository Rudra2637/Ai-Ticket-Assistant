/**
 * BaseAIProvider
 * Abstract base class defining the contract for AI triage providers.
 * Developers can extend this class to plug in any custom LLM or provider
 * (OpenAI, Claude, Ollama, DeepSeek, etc.).
 */
export class BaseAIProvider {
    /**
     * Analyze a technical support ticket and return structured triage metadata
     * @param {Object} ticket - { title: string, description: string }
     * @returns {Promise<{
     *   summary: string,
     *   priority: 'low' | 'medium' | 'high',
     *   helpfullNotes: string,
     *   relatedSkills: string[]
     * } | null>}
     */
    async analyzeTicket(ticket) {
        throw new Error("analyzeTicket() must be implemented by your AI provider");
    }
}
