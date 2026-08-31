import { MongoStorageAdapter } from './mongo.storage.js';
import { SupabaseStorageAdapter } from './supabase.storage.js';
import { BaseStorageAdapter } from './base.storage.js';

/**
 * Storage Factory
 * Auto-detects or creates the appropriate database adapter.
 *
 * Priority for detection:
 * 1. Explicit config parameter (e.g. { provider: 'supabase' } or { adapter: new CustomAdapter() })
 * 2. process.env.STORAGE_PROVIDER ('mongo' | 'supabase' | 'postgres')
 * 3. Auto-detection based on presence of SUPABASE_URL or MONGO_URI
 * 4. Default: 'mongo'
 *
 * @param {Object} config - Optional runtime configuration
 * @returns {BaseStorageAdapter}
 */
export function createStorage(config = {}) {
    // 1. If developer supplied their own custom adapter instance directly
    if (config.adapter instanceof BaseStorageAdapter) {
        return config.adapter;
    }

    // 2. Determine provider
    let provider = config.provider || process.env.STORAGE_PROVIDER;

    if (!provider) {
        if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
            provider = 'supabase';
        } else {
            provider = 'mongo';
        }
    }

    provider = provider.toLowerCase();

    // 3. Return chosen adapter
    if (provider === 'supabase' || provider === 'postgres' || provider === 'postgresql') {
        return new SupabaseStorageAdapter(config);
    }

    return new MongoStorageAdapter(config);
}

// Export default shared instance
export const storage = createStorage();

// Export all adapter classes for developers who want to extend or import them directly
export { BaseStorageAdapter, MongoStorageAdapter, SupabaseStorageAdapter };
