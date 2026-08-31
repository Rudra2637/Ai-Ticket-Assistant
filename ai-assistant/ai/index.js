import { DefaultAIProvider } from './default.ai.js';
import { BaseAIProvider } from './base.ai.js';

/**
 * AI Factory
 * Returns the default AI provider or a developer's custom AI provider.
 *
 * @param {Object} config - Optional AI configuration
 * @returns {BaseAIProvider}
 */
export function createAI(config = {}) {
    // 1. If developer supplied their own custom AI provider directly
    if (config.aiProvider instanceof BaseAIProvider) {
        return config.aiProvider;
    }

    // 2. Default standard AI provider (Groq / OpenAI / Custom)
    return new DefaultAIProvider(config);
}

// Export default shared instance
export const ai = createAI();

// Export classes for developers creating custom AI providers
export { BaseAIProvider, DefaultAIProvider };
