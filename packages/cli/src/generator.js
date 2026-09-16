import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { spinner } from '@clack/prompts';
import pc from 'picocolors';

const execAsync = promisify(exec);


export async function generateProject(options) {
    const s = spinner()
    s.start("Scaffolding project files...");
    // Now i need to create a project inside the users directory and after 
    // that write the .env files and all 
    const getCurrentDirectory = process.cwd();
    const createProject = path.resolve(getCurrentDirectory, options.projectName);

    // 2. Where our template code is located (go up 2 levels from cli/src)
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const packagesDir = path.resolve(__dirname, '../../');
    const backendSource = path.join(packagesDir, 'core');
    const dashboardSource = path.join(packagesDir, 'dashboard');

    const filter = (src) => {
        const base = path.basename(src);
        return !['node_modules', '.git', 'dist', 'build', '.env'].includes(base);
    };

    if (options.projectType === "fullstack") {
        await fs.copy(backendSource, path.join(createProject, 'backend'), { filter });
        await fs.copy(dashboardSource, path.join(createProject, 'dashboard'), { filter });
    } else {
        await fs.copy(backendSource, createProject, { filter });
    }

    // Configure AI provider environment variables
    let aiEnv = '';
    if (options.aiChoice === 'groq') {
        aiEnv = `GROQ_API_KEY=your_groq_api_key_here\nAI_MODEL=llama-3.3-70b-versatile`;
    } else if (options.aiChoice === 'openai') {
        aiEnv = `OPENAI_API_KEY=your_openai_api_key_here\nAI_MODEL=gpt-4o-mini`;
    } else if (options.aiChoice === 'claude') {
        aiEnv = `ANTHROPIC_API_KEY=your_anthropic_api_key_here\nAI_MODEL=claude-3-5-sonnet-20241022`;
    } else if (options.aiChoice === 'gemini') {
        aiEnv = `GEMINI_API_KEY=your_gemini_api_key_here\nAI_MODEL=gemini-1.5-flash`;
    }

    const envContent = `# Database
STORAGE_PROVIDER=${options.dbChoice}
${options.dbChoice === 'mongo'
    ? 'MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tickets'
    : 'SUPABASE_URL=https://your-project.supabase.co\nSUPABASE_KEY=your_supabase_anon_key'
}

# AI Engine
AI_PROVIDER=${options.aiChoice}
${aiEnv}

# Server
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
`;
    // Place .env in backend folder (if fullstack) or root (if backend-only)
    const envPath = options.projectType === 'fullstack'
        ? path.join(createProject, 'backend', '.env')
        : path.join(createProject, '.env');

    await fs.writeFile(envPath, envContent.trim());

    if (options.shouldInstall) {
        s.message("Installing dependencies with npm...");
        try {
            if (options.projectType === 'fullstack') {
                await execAsync('npm install', { cwd: path.join(createProject, 'backend') });
                await execAsync('npm install', { cwd: path.join(createProject, 'dashboard') });
            } else {
                await execAsync('npm install', { cwd: createProject });
            }
        } catch (err) {
            console.log("Note: Error running npm install automatically. Please run npm install manually.");
        }
    }

    s.stop("Project scaffolded successfully! 🎉");

}

