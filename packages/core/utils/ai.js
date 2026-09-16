import { ai } from '../ai/index.js';

/**
 * Universal analyzeTicket wrapper
 * Calls the active AI provider (Groq default or developer's custom AI provider).
 */
const analyzeTicket = async (ticket) => {
    return ai.analyzeTicket(ticket);
};

export default analyzeTicket;