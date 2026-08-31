import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import ThemeToggle from "../components/themeToggle";

function TicketDetailsPage() {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    let user = localStorage.getItem("user");
    if (user) {
        try {
            user = JSON.parse(user);
        } catch (e) {
            user = null;
        }
    }
    const navigate = useNavigate();

    const fetchTicket = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/tickets/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    method: "GET",
                }
            );
            const data = await res.json();
            console.log("Ticket Data: ", data)
            if (res.ok) {
                setTicket(data);
            } else {
                alert(data.message || "Failed to fetch ticket");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-[var(--text-muted)] font-semibold text-sm">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-t-purple-600 border-[var(--border-color)] rounded-full animate-spin"></div>
                    Loading ticket details...
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-[var(--bg-color)] flex flex-col items-center justify-center text-[var(--text-muted)] font-semibold text-sm space-y-4">
                <span>Ticket not found</span>
                <Link to="/" className="btn btn-primary btn-sm rounded-full">Go to Dashboard</Link>
            </div>
        );
    }

    const pStyle =
        ticket.priority === "high" ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-650" :
            ticket.priority === "medium" ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-650" :
                "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-650";

    const sStyle =
        ticket.status === "Done" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-655" :
            ticket.status === "In Progress" ? "bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30 text-sky-655" :
                "bg-slate-100 dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-muted)]";

    return (
        <div className="flex h-screen w-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden font-sans">

            {/* Sidebar */}
            <aside className="w-80 app-sidebar flex flex-col justify-between hidden md:flex shrink-0">
                <div className="flex flex-col flex-1 min-h-0">

                    {/* Header */}
                    <div className="p-5 flex items-center justify-between border-b border-[var(--border-color)]">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="font-extrabold text-[var(--text-color)] text-base">
                                TicketAI Panel
                            </span>
                        </Link>
                    </div>

                    {/* Back Dashboard */}
                    <div className="p-4">
                        <Link
                            to="/"
                            className="w-full py-2.5 px-4 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-slate-50 dark:hover:bg-slate-900 text-[var(--text-color)] text-xs font-bold flex items-center justify-center gap-2 transition duration-200 shadow-sm"
                        >
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="px-3 py-2 space-y-1">
                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-3 mb-2 font-mono">Workspace</div>
                        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-xs font-bold transition">
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            Support Tickets
                        </Link>

                        {user?.role === "admin" && (
                            <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-xs font-bold transition">
                                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Admin Dashboard
                            </Link>
                        )}
                    </nav>

                </div>

                {/* Sidebar User Footer */}
                <div className="p-4 border-t border-[var(--border-color)] bg-slate-100/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs text-[var(--text-color)] font-bold truncate">{user?.email}</span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest">{user?.role || "User"}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-[var(--text-muted)] hover:text-red-500 transition"
                        title="Logout"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full bg-[var(--bg-color)] relative overflow-hidden">

                {/* Header */}
                <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-950 dark:hover:text-slate-100 transition md:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <span className="text-sm font-bold text-[var(--text-color)] opacity-75">Ticket Details / #{ticket._id?.slice(-6)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                    </div>
                </header>

                {/* Content Container (Split Grid) */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row h-full">

                    {/* Left Column: Conversation Details */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-color)] leading-tight">{ticket.title}</h2>

                            {/* Client Prompt Bubble */}
                            <div className="p-5 rounded-2xl bg-slate-550/10 dark:bg-slate-900/40 border border-[var(--border-color)] space-y-3">
                                <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] font-mono font-bold">
                                    <span>CLIENT ISSUE REPORT</span>
                                    <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}</span>
                                </div>
                                <p className="text-[var(--text-color)] opacity-90 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                    {ticket.description}
                                </p>
                            </div>
                        </div>

                        {/* Simulated Activity Stream */}
                        <div className="pt-6 border-t border-[var(--border-color)] space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">Activity History</h3>

                            {/* Initial Trigger */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-[var(--text-color)] opacity-90">System Log</span>
                                        <span className="text-[9px] text-[var(--text-muted)] font-mono">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleTimeString() : ""}</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] font-medium">
                                        Ticket raised successfully. Inngest triggered `ticket/created` event workflow.
                                    </p>
                                </div>
                            </div>

                            {/* AI triaged */}
                            {ticket.status !== "TODO" && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-center justify-center shrink-0">
                                        <svg className="w-3.5 h-3.5 text-purple-650" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-purple-600">AI Triage Autopilot</span>
                                            <span className="text-[9px] text-[var(--text-muted)] font-mono">Triage Complete</span>
                                        </div>
                                        <p className="text-xs text-[var(--text-muted)] font-medium">
                                            Triaged ticket via Groq Llama 3.3. Identified requirements, priority level, and assigned moderator.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: AI Triage Co-Pilot Console */}
                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-900/10 p-6 md:p-8 space-y-6 overflow-y-auto shrink-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-muted)]">AI Triage Console</span>
                        </div>

                        {/* Priority / Status Cards */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-1 shadow-sm">
                                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Status</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase font-mono border tracking-tight ${sStyle}`}>
                                    {ticket.status || "Unknown"}
                                </span>
                            </div>
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-1 shadow-sm">
                                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Priority</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-bold uppercase font-mono border tracking-tight ${pStyle}`}>
                                    {ticket.priority || "Pending"}
                                </span>
                            </div>
                        </div>

                        {/* Assigned Moderator Info */}
                        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Assigned Support Staff</span>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-xs font-extrabold text-[var(--text-color)] opacity-85 uppercase font-mono">
                                    {ticket.assisgnedTo?.email ? ticket.assisgnedTo.email[0] : "?"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-extrabold text-[var(--text-color)] truncate">
                                        {ticket.assisgnedTo?.email || "Assigning..."}
                                    </span>
                                    <span className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase tracking-wider">
                                        {ticket.assisgnedTo?.email ? "Responsible Agent" : "AI Routing..."}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related Skill Tags */}
                        {ticket.relatedSkills?.length > 0 && (
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3 shadow-sm">
                                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Extracted Skill Requirements</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {ticket.relatedSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded bg-[var(--input-bg)] text-[var(--text-muted)] hover:text-[var(--text-color)] text-xs font-semibold border border-[var(--border-color)]"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AI Helpful Notes */}
                        {ticket.helpfullNotes && (
                            <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] space-y-3 shadow-sm">
                                <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">AI Helpful Notes & Tips</span>
                                <div className="prose prose-sm max-w-none text-xs text-[var(--text-muted)] font-medium leading-relaxed font-sans overflow-x-hidden dark:prose-invert">
                                    <ReactMarkdown>{ticket.helpfullNotes}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default TicketDetailsPage;
