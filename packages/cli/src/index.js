import { intro, outro, text, select, confirm, isCancel, cancel } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { getPackageManager, isExistingProject } from './utils.js';
import { generateProject } from './generator.js';

export async function run() {
    intro(pc.bgCyan(pc.black(" create-ticket-ai ")) + pc.bold(" - Scaffolding AI Support Assistant"));

    // 1. Ask for Project Name
    const arg = process.argv[2] ;
    const isInit = arg === 'init' || isExistingProject() ;

    let projectName = '';
    let targetDir = '';

    if(isInit) {
        targetDir = process.cwd() ;
        projectName = path.basename(targetDir) ;

        console.log(pc.cyan(`ℹ Initializing inside existing project: ${pc.bold(projectName)}\n`));
    }
    else {
         // Brand new project: ask for the project folder name
        
        const defaultName = (arg && arg !== 'init') ? arg : 'my-ticket-assistant';
        const nameInput = await text({
            message: "What is your project name?",
            placeholder: defaultName,
            defaultValue: defaultName,
            validate(value) {
                if (!value || value.trim().length === 0) return "Project name cannot be empty";
                if (/[^a-zA-Z0-9-_]/.test(value)) {
                    return "Project name can only contain letters, numbers, dashes, and underscores";
                }
            }
        });
        if (isCancel(nameInput)) {
            cancel("Setup cancelled.");
            process.exit(0);
        }
        projectName = nameInput.trim();
        targetDir = path.resolve(process.cwd(), projectName);
    }
    const pm = getPackageManager(targetDir) ; 
    const dbChoice = await select({
        message: "Which database adapter do you want to use or tell the current database adapter you are using?",
        options :[
            {value: "mongo", label: "MongoDB",hint: "Mongoose adapter"},
            { value: "supabase", label: "PostgreSQL (Supabase)", hint: "Supabase adapter with SQL schema" }
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
            { value: "groq", label: "Groq", hint: "Ultra-fast & free tier (recommended)" },
            { value: "openai", label: "OpenAI", hint: "GPT-4o / GPT-4o-mini" },
            { value: "claude", label: "Claude", hint: "Anthropic Claude 3.5 Sonnet" },
            { value: "gemini", label: "Gemini", hint: "Google Gemini 1.5 Flash" },
        ],
        initialValue: "groq"
    });
    if (isCancel(aiChoice)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }

    // 5. Ask whether to install dependencies automatically
    const shouldInstall = await confirm({
        message: `Install dependencies automatically with ${pc.cyan(pm.name)}?`,
        initialValue: true
    });
    if (isCancel(shouldInstall)) {
        cancel("Setup cancelled.");
        process.exit(0);
    }
    // 6. Summary Display
    console.log("\n" + pc.dim("─".repeat(50)));
    console.log(pc.green("✔ Collected Configuration:"));
    console.log(`  ${pc.bold("Mode:")}            ${isInit ? "Existing Project (init)" : "New Project"}`);
    console.log(`  ${pc.bold("Project:")}         ${projectName}`);
    console.log(`  ${pc.bold("Database:")}        ${dbChoice}`);
    console.log(`  ${pc.bold("AI Provider:")}     ${aiChoice}`);
    console.log(`  ${pc.bold("Package Manager:")} ${pm.name}`);
    console.log(`  ${pc.bold("Auto Install:")}    ${shouldInstall}`);
    console.log(pc.dim("─".repeat(50)) + "\n");
    // 7. Hand over to the Generator
    await generateProject({
        isInit,
        targetDir,
        projectName,
        dbChoice,
        aiChoice,
        shouldInstall,
        pm
    });
    // 8. Custom Outro based on Mode
    if (isInit) {
        outro(pc.green(`🚀 Ticket Assistant initialized!
        Next steps:
        1. Inspect ${pc.cyan('ticket.config.js')} and configure your auth middleware.
        2. Add your database & AI API keys to ${pc.cyan('.env')}.
        3. Mount ${pc.cyan('TicketAssistant')} in your Express server!`));
            } else {
                outro(pc.green(`🚀 Project created successfully!
        Next steps:
        ${pc.cyan(`cd ${projectName}`)}
        ${!shouldInstall ? pc.cyan(`${pm.installCmd}\n  `) : ''}${pc.cyan(`${pm.runCmd} dev`)}`));
    }

}
