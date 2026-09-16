import fs from "fs";
import path from "path";

/**
 * Detects the package manager being used (npm, pnpm, yarn, bun)
 * via process.env.npm_config_user_agent or filesystem lockfiles.
 *
 * @param {string} targetDir
 * @returns {{ name: 'npm' | 'pnpm' | 'yarn' | 'bun', installCmd: string, runCmd: string }}
 */

export function getPackageManager (targetDir = process.cwd()) {
    const userAgent = process.env.npm_config_user_agent || '' ;

    let name = 'npm';

    if(userAgent.startsWith('pnpm')) { 
        name = 'pnpm';
    } else if (userAgent.startsWith('yarn')) {
        name = 'yarn';
    } else if (userAgent.startsWith('bun')) {
        name = 'bun';
    } else if (userAgent.startsWith('npm')) {
        name = 'npm';
    } else {
        // 2. Fallback: inspect lockfiles in the target directory
        if (fs.existsSync(path.join(targetDir, 'pnpm-lock.yaml'))) {
            name = 'pnpm';
        } else if (fs.existsSync(path.join(targetDir, 'yarn.lock'))) {
            name = 'yarn';
        } else if (
            fs.existsSync(path.join(targetDir, 'bun.lockb')) ||
            fs.existsSync(path.join(targetDir, 'bun.lock'))
        ) {
            name = 'bun';
        } else if (fs.existsSync(path.join(targetDir, 'package-lock.json'))) {
            name = 'npm';
        }
    }

    const installCommands = {
        npm : 'npm install',
        pnpm: 'pnpm add',
        yarn: 'yarn add',
        bun: 'bun add'
    }
    
    return {
        name,
        installCmd: installCommands[name] || 'npm install',
        runCmd: name === 'npm' ? 'npm run' : name
    };
} 

/**
 * Checks if a directory is an already existing Node.js project.
 *
 * @param {string} targetDir
 * @returns {boolean}
 */
export function isExistingProject(targetDir = process.cwd()) {
    return fs.existsSync(path.join(targetDir, 'package.json'));
}