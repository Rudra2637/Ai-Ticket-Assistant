import { intro, outro, text, select, confirm, isCancel, cancel, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { generateProject } from './generator.js';

export async function run() {
    intro(pc.bgCyan(pc.black(" create-ticket-ai ")) + pc.bold(" - Scaffolding AI Support Assistant"));

    // 1. Ask for Project Name
    const defaultName = process.argv[2] || "my-ticket-app";
    const projectName = await text({
        message: "What is your project name?",
        placeholder: defaultName,
        defaultValue: defaultName,
        validate(value) {
            if (!value || value.trim().length === 0) return "Project name cannot be empty";
            if (/[^a-zA-Z0-9-_]/.test(value)) return "Project name can only contain letters, numbers, dashes, and underscores";
        }
    });

    if (isCancel(projectName)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    // 2. Ask for Setup Type
    const projectType = await select({
        message: "Which setup do you want?",
        options: [
            {
                value: "fullstack",
                label: "Frontend + Backend",
                hint: "Complete full-stack setup with React dashboard"
            },
            {
                value: "backend",
                label: "Backend Only",
                hint: "API server, Inngest workflows & database adapters"
            }
        ],
        initialValue: "fullstack"
    });

    if (isCancel(projectType)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    // 3. Ask for Database
    const dbChoice = await select({
        message: "Which database adapter do you want to use?",
        options: [
            { value: "mongo", label: "MongoDB", hint: "Mongoose adapter" },
            { value: "supabase", label: "PostgreSQL (Supabase)", hint: "Supabase adapter with schema" }
        ],
        initialValue: "mongo"
    });

    if (isCancel(dbChoice)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    // 4. Ask for AI Provider
    const aiChoice = await select({
        message: "Which AI triage provider do you want to use?",
        options: [
            { value: "groq", label: "Groq", hint: "Ultra-fast & recommended" },
            { value: "openai", label: "OpenAI", hint: "GPT-4o / GPT-4o-mini" },
            { value: "claude", label: "Claude", hint: "claude code" },
            { value: "gemini", label: "Gemini", hint: "free tier" },
        ],
        initialValue: "groq"
    });

    if (isCancel(aiChoice)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    // 5. Ask to install dependencies
    const shouldInstall = await confirm({
        message: "Install dependencies automatically?",
        initialValue: true
    });

    if (isCancel(shouldInstall)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    console.log("\n" + pc.dim("─".repeat(50)));
    console.log(pc.green("✔ Collected Configuration:"));
    console.log(`  ${pc.bold("Project:")}  ${projectName}`);
    console.log(`  ${pc.bold("Stack:")}    ${projectType}`);
    console.log(`  ${pc.bold("Database:")} ${dbChoice}`);
    console.log(`  ${pc.bold("AI:")}       ${aiChoice}`);
    console.log(`  ${pc.bold("Install:")}  ${shouldInstall}`);
    console.log(pc.dim("─".repeat(50)) + "\n");

    await generateProject({ projectName, projectType, dbChoice, aiChoice, shouldInstall });
    outro(pc.green(`🚀 All done! Next steps:
  ${pc.cyan(`cd ${projectName}`)}
  ${projectType === 'fullstack' ? pc.cyan('Start Backend:   cd backend && npm run dev\n  Start Dashboard: cd dashboard && npm run dev') : pc.cyan('npm run dev')}`));
}
