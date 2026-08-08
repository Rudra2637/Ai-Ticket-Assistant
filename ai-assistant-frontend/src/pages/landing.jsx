import { Link } from "react-router-dom";
import ThemeToggle from "../components/themeToggle";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] selection:bg-purple-100 selection:text-purple-900 overflow-hidden relative font-sans transition-colors duration-300 cyber-grid">

            {/* Ambient Pastel Background Glows */}
            <div className="absolute top-[10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-blue-400/10 blur-[130px] -z-10"></div>
            <div className="absolute top-[5%] right-[-15%] w-[60%] h-[50%] rounded-full bg-purple-400/10 blur-[130px] -z-10"></div>
            <div className="absolute bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-300/5 blur-[120px] -z-10"></div>

            {/* Header / Navbar */}
            <header className="w-full bg-[var(--bg-color)]/70 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between border-b border-[var(--border-color)] sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-[var(--text-color)]">
                        AI Ticket Assitant
                    </span>
                </div>

                {/* Center nav links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[var(--text-muted)]">
                    <a href="#features" className="hover:text-[var(--text-color)] transition">Product</a>
                    <a href="#how-it-works" className="hover:text-[var(--text-color)] transition">How it works</a>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <Link to="/login" className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-color)] transition">
                        Log in
                    </Link>
                    <Link to="/signup" className="px-5 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold transition shadow-sm">
                        Start for free
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-28 text-center flex flex-col items-center">

                {/* Hero Title */}
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[var(--text-color)] leading-[1.08] max-w-4xl mb-6">
                    The next generation <br />
                    AI triage for <span className="text-gradient-purple-blue">modern teams</span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl text-lg sm:text-xl text-[var(--text-muted)] font-medium mb-10 leading-relaxed">
                    Powerful, flexible, and beautiful. Finally, an AI ticket assistant people love to use. Automate manual client handling, tag routing, and SLA notifications in seconds.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
                    <Link
                        to="/signup"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-955 dark:bg-slate-50 text-dark dark:text-slate-900 hover:bg-slate-850 dark:hover:bg-slate-200 text-sm font-bold shadow-md shadow-slate-950/10 transition flex items-center justify-center gap-2 group"
                    >
                        Start for free
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                    <a
                        href="#features"
                        className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold transition flex items-center justify-center"
                    >
                        See how it works
                    </a>
                </div>

                {/* Visual UI Mockup (Attio Style Dashboard) */}
                <div className="relative w-full max-w-5xl rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] p-2.5 shadow-[0_30px_100px_var(--shadow-color)] transition-all">
                    <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--sidebar-bg)] aspect-[16/10] flex flex-col text-left">

                        {/* Mock App Header */}
                        <div className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between px-6">
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                                <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800"></span>
                            </div>
                            <div className="text-xs text-[var(--text-muted)] font-mono tracking-tight select-none">app.ticketai.com/inbox</div>
                            <div className="w-12"></div>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 flex overflow-hidden">

                            {/* Left Side menu */}
                            <div className="w-56 bg-[var(--bg-color)] border-r border-[var(--border-color)] p-4 space-y-6 hidden sm:block shrink-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--sidebar-bg)] text-[var(--text-color)] text-xs font-bold font-sans">
                                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        All tickets
                                    </div>
                                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--sidebar-bg)] text-xs font-semibold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        Search
                                    </div>
                                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--sidebar-bg)] text-xs font-semibold">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        Notifications
                                    </div>
                                </div>
                                <div className="space-y-1 pt-4 border-t border-[var(--border-color)]">
                                    <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-3 mb-2">Automations</div>
                                    <div className="h-6 w-32 bg-[var(--sidebar-bg)] rounded-md ml-3 mb-1.5"></div>
                                    <div className="h-6 w-24 bg-[var(--sidebar-bg)] rounded-md ml-3"></div>
                                </div>
                            </div>

                            {/* Right Grid table (Attio CRM-like list) */}
                            <div className="flex-1 bg-[var(--bg-color)] p-6 overflow-hidden flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-sm font-extrabold text-[var(--text-color)]">Support Inbox</h4>
                                    <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 text-purple-650 text-xs font-bold border border-purple-100/30">AI Autopilot Running</span>
                                </div>

                                <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-color)] flex-1 flex flex-col">
                                    {/* Table Header */}
                                    <div className="grid grid-cols-4 bg-[var(--sidebar-bg)] border-b border-[var(--border-color)] px-4 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                        <div>Ticket Details</div>
                                        <div>Required Skills</div>
                                        <div>Priority</div>
                                        <div>Assigned Moderator</div>
                                    </div>

                                    {/* Table Rows */}
                                    <div className="flex-1 divide-y divide-[var(--border-color)] text-xs text-[var(--text-color)]">
                                        <div className="grid grid-cols-4 px-4 py-3.5 items-center">
                                            <div className="font-semibold text-[var(--text-color)] truncate pr-4">Database sync lag in production</div>
                                            <div className="flex gap-1.5">
                                                <span className="px-2 py-0.5 rounded bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-muted)]">MongoDB</span>
                                                <span className="px-2 py-0.5 rounded bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-muted)]">Node.js</span>
                                            </div>
                                            <div>
                                                <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/20 text-red-650 border border-red-200/30 font-bold text-[10px]">High</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-[10px] font-bold flex items-center justify-center">S</div>
                                                <span className="font-medium text-[var(--text-color)]">sarah@company.com</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 px-4 py-3.5 items-center">
                                            <div className="font-semibold text-[var(--text-color)] truncate pr-4">Auth token validation error</div>
                                            <div className="flex gap-1.5">
                                                <span className="px-2 py-0.5 rounded bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-muted)]">JWT</span>
                                            </div>
                                            <div>
                                                <span className="px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-950/20 text-yellow-650 border border-yellow-200/30 font-bold text-[10px]">Medium</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-[10px] font-bold flex items-center justify-center">M</div>
                                                <span className="font-medium text-[var(--text-color)]">marc@company.com</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 px-4 py-3.5 items-center">
                                            <div className="font-semibold text-[var(--text-color)] truncate pr-4">CSS alignment bug on login screen</div>
                                            <div className="flex gap-1.5">
                                                <span className="px-2 py-0.5 rounded bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-muted)]">React</span>
                                                <span className="px-2 py-0.5 rounded bg-[var(--input-bg)] border border-[var(--border-color)] text-[10px] font-semibold text-[var(--text-muted)]">CSS</span>
                                            </div>
                                            <div>
                                                <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-650 border border-blue-200/30 font-bold text-[10px]">Low</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-[var(--sidebar-bg)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] font-bold flex items-center justify-center">?</div>
                                                <span className="font-medium text-[var(--text-muted)]">Unassigned</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Highlight */}
            <section id="features" className="bg-[var(--sidebar-bg)]/50 border-t border-[var(--border-color)] py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-color)] tracking-tight mb-4">Inside the AI-Triage Framework</h2>
                        <p className="text-[var(--text-muted)] max-w-xl mx-auto font-medium">
                            How we automate client support queues, bypass manual delegation bottlenecks, and boost resolution speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center mb-6 text-purple-650 shadow-sm border border-purple-100/50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Automated AI Analysis</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
                                Instantly triages support tickets using custom system prompts and Groq Llama models. It generates summaries and identifies complexity priorities.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mb-6 text-blue-650 shadow-sm border border-blue-100/50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Smart Skills Matching</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
                                Matches ticket contents with moderators who possess specific technology skills (e.g., Node.js, React). Ensures the right issues reach the right people.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 flex items-center justify-center mb-6 text-cyan-605 shadow-sm border border-cyan-100/50">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-color)] mb-2">Durable Notifications</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium">
                                Built on Inngest workflows, guaranteeing mail delivery for newly assigned tasks. Automatically retries if notifications temporarily fail.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-[var(--bg-color)] border-t border-[var(--border-color)] py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-color)] tracking-tight mb-4">How it works</h2>
                        <p className="text-[var(--text-muted)] max-w-xl mx-auto font-medium">
                            A seamless automated pipeline connecting your client to the right technician in seconds.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line for steps */}
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--border-color)] -translate-y-1/2 hidden lg:block -z-10"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                            {/* Step 1 */}
                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm relative flex flex-col items-center text-center">
                                <span className="absolute -top-4 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center border border-[var(--border-color)] shadow-sm">1</span>
                                <h3 className="text-base font-extrabold text-[var(--text-color)] mt-4 mb-2">Submit Request</h3>
                                <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed">
                                    Client submits a ticket with description of their technical challenge.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm relative flex flex-col items-center text-center">
                                <span className="absolute -top-4 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center border border-[var(--border-color)] shadow-sm">2</span>
                                <h3 className="text-base font-extrabold text-[var(--text-color)] mt-4 mb-2">AI Extraction</h3>
                                <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed">
                                    Groq Llama 3.3 triages priority levels and extracts required expertise skills.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm relative flex flex-col items-center text-center">
                                <span className="absolute -top-4 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center border border-[var(--border-color)] shadow-sm">3</span>
                                <h3 className="text-base font-extrabold text-[var(--text-color)] mt-4 mb-2">Durable Routing</h3>
                                <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed">
                                    Inngest event loops query database and match skills with available moderators.
                                </p>
                            </div>

                            {/* Step 4 */}
                            <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm relative flex flex-col items-center text-center">
                                <span className="absolute -top-4 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm flex items-center justify-center border border-[var(--border-color)] shadow-sm">4</span>
                                <h3 className="text-base font-extrabold text-[var(--text-color)] mt-4 mb-2">Instant Alert</h3>
                                <p className="text-[var(--text-muted)] text-xs font-medium leading-relaxed">
                                    Assigned moderator gets email notification & dashboard update to begin resolution.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[var(--border-color)] py-10 bg-[var(--bg-color)] text-[var(--text-muted)] text-xs text-center font-medium flex flex-col items-center gap-4 transition-colors duration-300">
                <a href="https://github.com/Rudra2637/Ai-Ticket-Assistant" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-color)] transition font-bold" title="View GitHub Repository">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>Rudra2637 / Ai-Ticket-Assistant</span>
                </a>
                <p>&copy; {new Date().getFullYear()} TicketAI Inc. All rights reserved. Automated with Inngest & Groq.</p>
            </footer>
        </div>
    );
}
