#!/usr/bin/env node

import { run } from '../src/index.js';

run().catch((err) => {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
});