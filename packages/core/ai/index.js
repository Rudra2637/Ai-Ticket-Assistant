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

let activeAI = null;

export function setActiveAI(aiInstance) {
    activeAI = aiInstance;
}

export function getActiveAI() {
    if (!activeAI) {
        activeAI = createAI();
    }
    return activeAI;
}

// Export dynamic proxy that delegates to the active AI instance
export const ai = new Proxy({}, {
    get(target, prop) {
        const instance = getActiveAI();
        const value = instance[prop];
        return typeof value === 'function' ? value.bind(instance) : value;
    }
});

// Export classes for developers creating custom AI providers
export { BaseAIProvider, DefaultAIProvider };

