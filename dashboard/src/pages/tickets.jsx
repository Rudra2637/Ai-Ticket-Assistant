import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/themeToggle";

function Tickets() {
    const [form, setForm] = useState({ title: "", description: "" });
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const token = localStorage.getItem("token");
    let initialUser = localStorage.getItem("user");
    if (initialUser) {
        try {
            initialUser = JSON.parse(initialUser);
        } catch (e) {
            initialUser = null;
        }
    }
    const [currentUser, setCurrentUser] = useState(initialUser);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [moderatorSkills, setModeratorSkills] = useState(initialUser?.skills || []);
    const [newSkillInput, setNewSkillInput] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    const navigate = useNavigate();

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
                headers: { Authorization: `Bearer ${token}` },
                method: "GET",
            });
            const data = await res.json();
            const sortedData = Array.isArray(data) ? data : [];
            setTickets(sortedData);
            setFilteredTickets(sortedData);
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        let result = tickets;

        if (statusFilter !== "ALL") {
            result = result.filter(t => t.status?.toUpperCase() === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query)
            );
        }

        setFilteredTickets(result);
    }, [tickets, searchQuery, statusFilter]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.description.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setForm({ title: "", description: "" });
                fetchTickets(); // Refresh list
            } else {
                alert(data.message || "Ticket creation failed");
            }
        } catch (err) {
            alert("Error creating ticket");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addModeratorSkill = (e) => {
        e.preventDefault();
        const trimmed = newSkillInput.trim();
        if (trimmed && !moderatorSkills.includes(trimmed)) {
            setModeratorSkills([...moderatorSkills, trimmed]);
            setNewSkillInput("");
        }
    };

    const removeModeratorSkill = (idxToRemove) => {
        setModeratorSkills(moderatorSkills.filter((_, idx) => idx !== idxToRemove));
    };

    const saveModeratorProfile = async () => {
        setUpdatingProfile(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/update-User`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: currentUser?.email,
                    skills: moderatorSkills
                })
            });
            const data = await res.json();
            if (res.ok) {
                const updated = data.user || { ...currentUser, skills: moderatorSkills };
                setCurrentUser(updated);
                localStorage.setItem("user", JSON.stringify(updated));
                setShowProfileModal(false);
            } else {
                alert(data.error || "Failed to update profile skills");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating skills");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div className="flex h-screen w-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden font-sans">

            {/* Sidebar (Attio CRM-like style) */}
            <aside className="w-80 app-sidebar flex flex-col justify-between hidden md:flex shrink-0">
                <div className="flex flex-col flex-1 min-h-0">

                    {/* Header */}
                    <div className="p-5 flex items-center justify-between border-b border-[var(--border-color)]">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <span className="font-extrabold text-[var(--text-color)] text-base">
                                TicketAI Panel
                            </span>
                        </Link>
                    </div>

                    {/* New Ticket Button (Clients only) */}
                    {currentUser?.role === "user" && (
                        <div className="p-4">
                            <button
                                onClick={() => {
                                    document.getElementById("ticket-composer").scrollIntoView({ behavior: 'smooth' });
                                    document.getElementById("title-input")?.focus();
                                }}
                                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition duration-200 shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Ticket
                            </button>
                        </div>
                    )}

                    {/* Edit Skills Button (Moderators) */}
                    {/* Navigation */}
                    <nav className="px-3 py-2 space-y-1">
                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-3 mb-2 font-mono">Workspace</div>
                        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[var(--text-color)] text-xs font-bold transition">
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            Support Tickets
                        </Link>

                        {currentUser?.role === "admin" && (
                            <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-xs font-bold transition">
                                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Admin Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Recent Ticket List */}
                    <div className="flex-1 overflow-y-auto px-3 py-4 border-t border-[var(--border-color)]">
                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-3 mb-2 font-mono">Recent Threads</div>
                        <div className="space-y-0.5">
                            {tickets.slice(0, 10).map((t) => (
                                <Link
                                    key={t._id}
                                    to={`/ticket/${t._id}`}
                                    className="block px-3 py-1.5 rounded-lg hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-xs text-[var(--text-muted)] hover:text-[var(--text-color)] truncate transition font-medium"
                                >
                                    # {t.title}
                                </Link>
                            ))}
                            {tickets.length === 0 && (
                                <span className="text-[10px] text-[var(--text-muted)] px-3">No recent tickets</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar User Footer */}
                <div className="p-4 border-t border-[var(--border-color)] bg-slate-100/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs text-[var(--text-color)] font-bold truncate">{currentUser?.email}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest">{currentUser?.role || "User"}</span>
                            {currentUser?.role === "moderator" && (
                                <button
                                    onClick={() => {
                                        setModeratorSkills(currentUser?.skills || []);
                                        setShowProfileModal(true);
                                    }}
                                    className="text-[9px] text-purple-600 dark:text-purple-400 font-bold hover:underline"
                                    title="Edit your skills"
                                >
                                    (edit skills)
                                </button>
                            )}
                        </div>
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

            {/* Main Workspace Area */}
            <main className="flex-1 flex flex-col min-w-0 h-full bg-[var(--bg-color)] relative overflow-hidden">

                {/* Dashboard Topbar */}
                <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--text-color)] opacity-85 md:block hidden">Support Inbox Queue</span>

                        {/* Mobile Header */}
                        <div className="flex items-center gap-2 md:hidden">
                            <span className="font-extrabold text-sm text-[var(--text-color)]">TicketAI</span>
                        </div>
                    </div>

                    {/* Search, ThemeToggle, and Filters */}
                    <div className="flex items-center gap-3 w-full max-w-sm ml-auto">
                        <ThemeToggle />
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search ticket details..."
                                className="w-full app-input rounded-xl pl-9 pr-4 py-1.5 text-xs placeholder-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Mobile Logout */}
                        <button onClick={logout} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-[var(--border-color)] hover:text-red-500 transition md:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Scroll Workspace */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">

                    {/* Moderator Profile & Skills Banner */}
                    {currentUser?.role === "moderator" ? (
                        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                                        Moderator Workspace
                                    </span>
                                </div>
                                <h2 className="text-lg font-extrabold text-[var(--text-color)]">
                                    Assigned Tickets & Expertise
                                </h2>
                                <p className="text-[var(--text-muted)] text-xs leading-relaxed font-medium max-w-2xl">
                                    Inngest AI triage matches incoming client tickets to your technical skills. Below are your active expertise tags.
                                </p>

                                {/* Skills preview */}
                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                    <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] tracking-wider">Your Skills:</span>
                                    {currentUser?.skills && currentUser.skills.length > 0 ? (
                                        currentUser.skills.map((skill, idx) => (
                                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[var(--card-bg)] text-xs font-semibold text-[var(--text-color)] border border-[var(--border-color)] shadow-xs">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-amber-500 font-semibold italic">No skills configured yet. Click "Edit Skills" to add your skills!</span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setModeratorSkills(currentUser?.skills || []);
                                    setShowProfileModal(true);
                                }}
                                className="px-4 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit My Skills
                            </button>
                        </div>
                    ) : (
                        /* Default Info Banner for User and Admin */
                        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] w-20 h-20 rounded-full bg-purple-500/5 blur-xl"></div>
                            <h2 className="text-lg font-extrabold text-[var(--text-color)] mb-1">
                                {currentUser?.role === "admin" ? "Administrator Support Queue" : "AI Ticketing & Routing Dashboard"}
                            </h2>
                            <p className="text-[var(--text-muted)] text-xs max-w-xl leading-relaxed font-medium">
                                {currentUser?.role === "admin"
                                    ? "You have full access to view and monitor all system tickets across every department and moderator."
                                    : "Welcome! When you raise a ticket, Inngest triggers an automated AI triage loop (using Llama 3.3 via Groq) to summarize, prioritize, and assign it to the matching moderator."
                                }
                            </p>
                        </div>
                    )}

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1.5">
                        {["ALL", "TODO", "IN PROGRESS", "DONE"].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-1 rounded-full text-xs font-bold tracking-tight transition ${statusFilter === filter
                                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Tickets Grid */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 font-mono">
                            {currentUser?.role === "moderator" ? "My Assigned Tickets" : "Active Tickets"} ({filteredTickets.length})
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredTickets.map((ticket) => {
                                const pStyle =
                                    ticket.priority === "high" ? "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-650" :
                                        ticket.priority === "medium" ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/30 text-yellow-650" :
                                            "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-650";

                                const sStyle =
                                    ticket.status === "Done" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-655" :
                                        ticket.status === "In Progress" ? "bg-sky-50 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30 text-sky-655" :
                                            "bg-slate-100 dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-muted)]";

                                return (
                                    <Link
                                        key={ticket._id}
                                        className="p-5 rounded-2xl app-card app-card-hover flex flex-col justify-between h-48"
                                        to={`/ticket/${ticket._id}`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className="font-extrabold text-sm text-[var(--text-color)] truncate flex-1">{ticket.title}</h4>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {ticket.status && (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border uppercase tracking-tight ${sStyle}`}>
                                                            {ticket.status}
                                                        </span>
                                                    )}
                                                    {ticket.priority && (
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border uppercase tracking-tight ${pStyle}`}>
                                                            {ticket.priority}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-[var(--text-muted)] text-xs line-clamp-3 leading-relaxed font-medium">{ticket.description}</p>
                                        </div>

                                        {/* Footer attributes */}
                                        <div className="border-t border-[var(--border-color)] pt-3 flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1.5 overflow-hidden">
                                                {ticket.relatedSkills?.slice(0, 3).map((skill, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-[var(--input-bg)] text-[var(--text-muted)] text-[10px] font-bold border border-[var(--border-color)]">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {ticket.relatedSkills?.length > 3 && (
                                                    <span className="text-[10px] text-[var(--text-muted)] font-bold">+{ticket.relatedSkills.length - 3}</span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-[var(--text-muted)] font-semibold shrink-0 font-mono">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {filteredTickets.length === 0 && (
                            <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-slate-50/20 dark:bg-slate-900/10">
                                <svg className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-[var(--text-muted)] text-xs font-bold">
                                    {currentUser?.role === "moderator"
                                        ? "No tickets assigned to you"
                                        : (currentUser?.role === "admin" || currentUser?.role === "user")
                                            ? "No tickets created yet"
                                            : "No support tickets found"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Composer at the bottom (Clients only) */}
                {currentUser?.role === "user" && (
                    <div id="ticket-composer" className="p-6 bg-[var(--bg-color)] border-t border-[var(--border-color)] shrink-0 z-10">
                        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-[var(--composer-bg)] rounded-2xl border border-[var(--border-color)] shadow-[0_15px_50px_var(--shadow-color)] p-4 space-y-3 relative">
                            <div className="absolute top-[-10px] left-4 px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 text-[9px] font-bold text-purple-650 uppercase tracking-widest font-mono">
                                AI Co-Pilot Triage
                            </div>

                            <input
                                id="title-input"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Issue summary / Title (e.g. Database connection failure)"
                                className="w-full app-input rounded-xl px-4 py-2.5 text-xs placeholder-slate-400 font-medium"
                                required
                            />

                            <div className="relative">
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Describe the issue in detail. The AI will extract relevant tags, triage the ticket, and assign a moderator..."
                                    className="w-full app-input rounded-xl pl-4 pr-12 pt-3 pb-3 text-xs placeholder-slate-400 min-h-[70px] max-h-[140px] resize-y transition font-medium"
                                    required
                                />

                                <button
                                    className="absolute right-3 bottom-3.5 p-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow transition disabled:opacity-50"
                                    type="submit"
                                    disabled={loading}
                                    title="Submit Ticket"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>

            {/* Moderator Edit Profile / Skills Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                            <div>
                                <h3 className="text-base font-extrabold text-[var(--text-color)]">Edit Moderator Profile</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium">Update your technical skills for automated AI ticket matching</p>
                            </div>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1 leading-none transition"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Account Email (Read-only) */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">Account Email</label>
                            <input
                                type="text"
                                value={currentUser?.email || ""}
                                disabled
                                className="w-full app-input rounded-xl px-4 py-2 text-xs opacity-60 cursor-not-allowed font-medium"
                            />
                        </div>

                        {/* Skills Tag Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">
                                Specialized Skills ({moderatorSkills.length})
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type skill (e.g. React, Python, MongoDB) and press Add"
                                    className="flex-1 app-input rounded-xl px-4 py-2 text-xs placeholder-slate-400 font-medium"
                                    value={newSkillInput}
                                    onChange={(e) => setNewSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addModeratorSkill(e);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addModeratorSkill}
                                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition shadow-xs"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-2 pt-2 min-h-[60px] p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border-color)] max-h-40 overflow-y-auto">
                                {moderatorSkills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-color)] shadow-xs"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeModeratorSkill(idx)}
                                            className="hover:text-red-500 transition text-[14px] leading-none"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                                {moderatorSkills.length === 0 && (
                                    <span className="text-xs text-[var(--text-muted)] italic font-medium">No skills listed. Add some skills above!</span>
                                )}
                            </div>
                        </div>

                        {/* Modal footer buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                            <button
                                type="button"
                                onClick={() => setShowProfileModal(false)}
                                className="px-4 py-2 rounded-full border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-[var(--text-color)] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveModeratorProfile}
                                disabled={updatingProfile}
                                className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                            >
                                {updatingProfile ? "Saving Changes..." : "Save Profile Skills"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tickets;