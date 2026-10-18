export interface AgentData {
    id?: string;
    _id?: string;
    email: string;
    name?: string | null;
    password?: string;
    passwordHash?: string;
    skills?: string[];
    authProviderId?: string | null;
    metadata?: Record<string, any>;
    createdAt?: Date | string;
}

export interface TicketData {
    id?: string;
    _id?: string;
    title: string;
    description: string;
    status?: 'open' | 'in_progress' | 'closed' | string;
    priority?: 'low' | 'medium' | 'high' | string;
    createdBy?: string | null;
    assignedTo?: AgentData | string | null;
    relatedSkills?: string[];
    helpfulNotes?: string;
    deadline?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface TicketAssistantAIConfig {
    provider?: 'gemini' | 'groq' | 'openai' | 'ollama' | 'deepseek' | string;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
}

export interface TicketAssistantStorageConfig {
    provider?: 'mongo' | 'supabase' | string;
    mongoUri?: string;
    connection?: any;
    supabaseUrl?: string;
    supabaseKey?: string;
    supabaseClient?: any;
}

export interface TicketAssistantAuthConfig {
    middleware?: any;
    adminMiddleware?: any;
    agentMiddleware?: any;
}

export interface TicketAssistantConfig {
    storage?: 'mongo' | 'supabase' | TicketAssistantStorageConfig | any;
    database?: 'mongo' | 'supabase';
    mongoUri?: string;
    supabaseUrl?: string;
    supabaseKey?: string;
    ai?: 'gemini' | 'groq' | 'openai' | TicketAssistantAIConfig | any;
    aiProvider?: string;
    auth?: TicketAssistantAuthConfig;
    agents?: AgentData[];
    server?: {
        port?: number;
    };
}

export declare class TicketAssistant {
    config: TicketAssistantConfig;
    storage: any;
    ai: any;

    constructor(config?: TicketAssistantConfig);

    connect(): Promise<void>;

    createTicket(data: {
        title: string;
        description: string;
        createdBy?: string | null;
    }): Promise<TicketData>;

    getTickets(filter?: {
        status?: string;
        assignedTo?: string;
        createdBy?: string;
        [key: string]: any;
    }): Promise<TicketData[]>;

    getTicket(id: string): Promise<TicketData | null>;

    updateTicket(id: string, updates: Partial<TicketData>): Promise<TicketData | null>;

    createAgent(data: AgentData): Promise<AgentData>;

    getAgents(): Promise<AgentData[]>;

    getAgentByEmail(
        email: string,
        options?: { includePassword?: boolean }
    ): Promise<AgentData | null>;

    verifyAgentCredentials(
        email: string,
        password: string
    ): Promise<AgentData | null>;

    updateAgent(id: string, updates: Partial<AgentData>): Promise<AgentData | null>;

    deleteAgent(id: string): Promise<boolean>;

    seedAgents(): Promise<AgentData[]>;

    getRouter(): Promise<any>;

    startServer(options?: { port?: number }): Promise<{
        app: any;
        server: any;
        port: number;
    }>;
}

export declare function defineConfig(config: TicketAssistantConfig): TicketAssistantConfig;

export declare function hashPassword(password: string): string;

export declare function verifyPassword(password: string, storedHash: string): boolean;

export declare function onticketCreate(ticket: {
    id: string;
    title: string;
    description: string;
}): Promise<any>;

export declare class BaseStorageAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    runMigrations(): Promise<boolean>;
    createAgent(agentData: any): Promise<any>;
    getAgentByEmail(email: string, options?: any): Promise<any>;
    getAgentById(id: string): Promise<any>;
    getAgents(filter?: any): Promise<any[]>;
    updateAgent(id: string, updates: any): Promise<any>;
    deleteAgent(id: string): Promise<boolean>;
    createTicket(ticketData: any): Promise<any>;
    getTicketById(id: string): Promise<any>;
    getTickets(filter?: any): Promise<any[]>;
    updateTicket(id: string, updates: any): Promise<any>;
    deleteTicket(id: string): Promise<boolean>;
}

export declare class MongoStorageAdapter extends BaseStorageAdapter {
    constructor(config?: { mongoUri?: string; connection?: any });
}

export declare class SupabaseStorageAdapter extends BaseStorageAdapter {
    constructor(config?: {
        supabaseUrl?: string;
        supabaseKey?: string;
        supabaseClient?: any;
    });
}

export declare class BaseAI {
    analyzeTicket(ticket: { title: string; description: string }): Promise<any>;
}

export declare class DefaultAI extends BaseAI {
    constructor(config?: TicketAssistantAIConfig);
}
