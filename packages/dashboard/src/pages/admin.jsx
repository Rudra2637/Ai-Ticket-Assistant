import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from "../components/themeToggle"

function Admin() {
    const [moderators, setModerators] = useState([]);
    const [filteredModerators, setFilteredModerators] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Add Moderator Modal State
    const [showAddModModal, setShowAddModModal] = useState(false);
    const [modForm, setModForm] = useState({ email: "", password: "" });
    const [modLoading, setModLoading] = useState(false);
    const [modError, setModError] = useState("");

    const token = localStorage.getItem("token");
    let loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
        try {
            loggedInUser = JSON.parse(loggedInUser);
        } catch (e) {
            loggedInUser = null;
        }
    }
    const navigate = useNavigate();

    useEffect(() => {
        fetchModerators();
    }, []);

    const fetchModerators = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                const fetched = Array.isArray(data.user) ? data.user : [];
                setModerators(fetched);
                setFilteredModerators(fetched);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Error fetching moderators", err);
        }
    };

    useEffect(() => {
        let result = moderators;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.email?.toLowerCase().includes(query) ||
                u._id?.toLowerCase().includes(query) ||
                u.skills?.some(s => s.toLowerCase().includes(query))
            );
        }

        setFilteredModerators(result);
    }, [moderators, searchQuery]);

    const handleCreateModerator = async (e) => {
        e.preventDefault();
        if (!modForm.email.trim() || !modForm.password.trim()) {
            setModError("Please provide both email and password");
            return;
        }
        setModLoading(true);
        setModError("");

        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: modForm.email,
                    password: modForm.password,
                    role: "moderator",
                    skills: [],
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setModForm({ email: "", password: "" });
                setShowAddModModal(false);
                fetchModerators();
            } else {
                setModError(data.message || data.error || "Failed to create moderator");
            }
        } catch (error) {
            console.error("Error creating moderator:", error);
            setModError("Network error. Please try again.");
        } finally {
            setModLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const totalModerators = moderators.length;
    const allSkills = Array.from(new Set(moderators.flatMap(m => m.skills || [])));

    return (
        <div className="flex h-screen w-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden font-sans">

            {/* Sidebar (Attio CRM style) */}
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



                    {/* Navigation */}
                    <nav className="px-3 py-2 space-y-1">
                        <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider px-3 mb-2 font-mono font-bold">Workspace</div>
                        <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-color)] hover:bg-slate-200/40 dark:hover:bg-slate-800/40 text-xs font-bold transition">
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            Support Tickets
                        </Link>

                        <Link to="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[var(--text-color)] text-xs font-bold transition">
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Moderators Console
                        </Link>
                    </nav>
                </div>

                {/* Sidebar User Footer */}
                <div className="p-4 border-t border-[var(--border-color)] bg-slate-100/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs text-[var(--text-color)] font-bold truncate">{loggedInUser?.email}</span>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest">{loggedInUser?.role || "User"}</span>
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

                {/* Topbar */}
                <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-color)] flex items-center justify-between px-6 z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--text-color)] opacity-85 md:block hidden font-sans">Moderator Management Console</span>

                        {/* Mobile Header */}
                        <div className="flex items-center gap-2 md:hidden">
                            <Link to="/" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-955 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <span className="font-extrabold text-sm text-[var(--text-color)]">Moderators</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-md ml-auto">
                        <ThemeToggle />

                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search moderators & skills..."
                                className="w-full app-input rounded-xl pl-9 pr-4 py-1.5 text-xs placeholder-slate-450 font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <svg className="w-3.5 h-3.5 text-slate-450 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Dashboard Scroll Workspace */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 pb-12">

                    {/* Welcome Banner */}
                    <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-slate-550/10 dark:bg-slate-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                        <div className="space-y-1">
                            <h2 className="text-lg font-extrabold text-[var(--text-color)]">Support Team & Moderator Console</h2>
                            <p className="text-[var(--text-muted)] text-xs max-w-xl leading-relaxed font-medium">
                                Create and monitor support moderators. The Inngest AI triage engine uses each moderator's technical skills to assign incoming tickets automatically.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setModError("");
                                setModForm({ email: "", password: "" });
                                setShowAddModModal(true);
                            }}
                            className="px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0 self-start md:self-auto"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Create Moderator Account
                        </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Active Support Moderators</span>
                            <span className="text-3xl font-black text-purple-600">{totalModerators}</span>
                        </div>
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Unique Domain Skills</span>
                            <span className="text-3xl font-black text-[var(--text-color)]">{allSkills.length}</span>
                        </div>
                    </div>

                    {/* Moderators List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono">
                                Support Moderators ({filteredModerators.length})
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {filteredModerators.map((modItem) => (
                                <div
                                    key={modItem._id}
                                    className="p-5 rounded-2xl app-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-300 dark:hover:border-purple-900/40 transition"
                                >
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300 uppercase font-mono">
                                                {modItem.email[0]}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-[var(--text-color)] truncate">{modItem.email}</span>
                                                <span className="text-[10px] text-[var(--text-muted)] font-mono">{modItem._id}</span>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold font-mono border uppercase tracking-wider bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30 text-purple-655">
                                                Moderator
                                            </span>
                                        </div>

                                        {/* Skill list */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {modItem.skills && modItem.skills.length > 0 ? (
                                                modItem.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[var(--input-bg)] text-[10px] text-[var(--text-muted)] font-semibold border border-[var(--border-color)] shadow-2xs">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-amber-500 font-semibold italic">No skills configured by moderator yet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredModerators.length === 0 && (
                                <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border-color)] bg-slate-50/20 dark:bg-slate-900/10">
                                    <p className="text-[var(--text-muted)] text-xs font-bold">No moderators found. Click "+ Add Moderator" above to create one.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Add Moderator Modal */}
            {showAddModModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                            <div>
                                <h3 className="text-base font-extrabold text-[var(--text-color)]">Create Support Moderator</h3>
                                <p className="text-xs text-[var(--text-muted)] font-medium">Add a new support moderator to the platform</p>
                            </div>
                            <button
                                onClick={() => setShowAddModModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold p-1 leading-none transition"
                            >
                                &times;
                            </button>
                        </div>

                        {modError && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-medium">
                                {modError}
                            </div>
                        )}

                        <form onSubmit={handleCreateModerator} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">Moderator Email Address</label>
                                <input
                                    type="email"
                                    placeholder="agent@company.com"
                                    required
                                    value={modForm.email}
                                    onChange={(e) => setModForm({ ...modForm, email: e.target.value })}
                                    className="w-full app-input rounded-xl px-4 py-2.5 text-xs font-medium placeholder-slate-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-mono font-bold text-[var(--text-muted)]">Temporary Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={modForm.password}
                                    onChange={(e) => setModForm({ ...modForm, password: e.target.value })}
                                    className="w-full app-input rounded-xl px-4 py-2.5 text-xs font-medium placeholder-slate-400"
                                />
                                <p className="text-[10px] text-[var(--text-muted)] font-medium">
                                    The moderator will use these credentials to log in and configure their specialized technical skills.
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModModal(false)}
                                    className="px-4 py-2 rounded-full border border-[var(--border-color)] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-[var(--text-color)] transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={modLoading}
                                    className="px-4 py-2 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold transition flex items-center gap-2 shadow-sm shrink-0 self-start md:self-auto"
                                >
                                    {modLoading ? "Creating..." : "Create Moderator"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;