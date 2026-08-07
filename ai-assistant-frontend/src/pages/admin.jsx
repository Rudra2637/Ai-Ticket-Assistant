import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from "../components/themeToggle"

function Admin() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ role: "", skills: "" });
    const [searchQuery, setSearchQuery] = useState("");

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
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                const fetchedUsers = Array.isArray(data.user) ? data.user : [];
                setUsers(fetchedUsers);
                setFilteredUsers(fetchedUsers);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Error fetching users", err);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user.email);
        setFormData({
            role: user.role,
            skills: user.skills?.join(", ") || "",
        });
    };

    const handleUpdate = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/auth/update-User`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: editingUser,
                        role: formData.role,
                        skills: formData.skills
                            .split(",")
                            .map((skill) => skill.trim())
                            .filter(Boolean),
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to update user");
                console.error(data.error || "Failed to update user");
                return;
            }

            setEditingUser(null);
            setFormData({ role: "", skills: "" });
            fetchUsers();
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredUsers(
            users.filter((user) => user.email.toLowerCase().includes(query))
        );
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const totalUsersCount = users.length;
    const adminCount = users.filter(u => u.role === "admin").length;
    const moderatorCount = users.filter(u => u.role === "moderator").length;
    const staffCount = users.filter(u => u.role === "user").length;

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
                            Admin Dashboard
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
                        <span className="text-sm font-bold text-[var(--text-color)] opacity-85 md:block hidden font-sans">Administration Console</span>
                        
                        {/* Mobile Header */}
                        <div className="flex items-center gap-2 md:hidden">
                            <Link to="/" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-955 transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <span className="font-extrabold text-sm text-[var(--text-color)]">Admin Panel</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full max-w-sm ml-auto">
                        <ThemeToggle />
                        <div className="relative w-full">
                            <input 
                                type="text"
                                placeholder="Search by email..."
                                className="w-full app-input rounded-xl pl-9 pr-4 py-1.5 text-xs placeholder-slate-450"
                                value={searchQuery}
                                onChange={handleSearch}
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
                    <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-slate-550/10 dark:bg-slate-900/10 relative overflow-hidden">
                        <h2 className="text-lg font-extrabold text-[var(--text-color)] mb-1">Administrative Team Console</h2>
                        <p className="text-[var(--text-muted)] text-xs max-w-xl leading-relaxed font-medium">
                            Control roles and skills for all users. The AI routing engine reads these skills to assign incoming client tickets dynamically.
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">All Accounts</span>
                            <span className="text-3xl font-black text-[var(--text-color)]">{totalUsersCount}</span>
                        </div>
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Moderators</span>
                            <span className="text-3xl font-black text-purple-600">{moderatorCount}</span>
                        </div>
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Administrators</span>
                            <span className="text-3xl font-black text-blue-600">{adminCount}</span>
                        </div>
                        <div className="p-5 rounded-2xl app-card space-y-1 shadow-sm">
                            <span className="text-[10px] text-[var(--text-muted)] font-mono font-bold uppercase block">Standard Users</span>
                            <span className="text-3xl font-black text-cyan-600">{staffCount}</span>
                        </div>
                    </div>

                    {/* Users Management Grid */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 font-mono">
                            System Users Profiles ({filteredUsers.length})
                        </h3>

                        <div className="space-y-3">
                            {filteredUsers.map((userItem) => {
                                const roleBadgeStyle = 
                                    userItem.role === "admin" ? "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30 text-blue-650" :
                                    userItem.role === "moderator" ? "bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30 text-purple-655" :
                                    "bg-slate-100 dark:bg-slate-800 border-[var(--border-color)] text-[var(--text-muted)]";

                                return (
                                    <div
                                        key={userItem._id}
                                        className="p-5 rounded-2xl app-card flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-350 dark:hover:border-slate-800 transition"
                                    >
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-color)] uppercase font-mono">
                                                    {userItem.email[0]}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-[var(--text-color)] truncate">{userItem.email}</span>
                                                    <span className="text-[10px] text-[var(--text-muted)] font-mono">{userItem._id}</span>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold font-mono border uppercase tracking-wider ${roleBadgeStyle}`}>
                                                    {userItem.role}
                                                </span>
                                            </div>

                                            {/* Skill list */}
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {userItem.skills && userItem.skills.length > 0 ? (
                                                    userItem.skills.map((skill, idx) => (
                                                        <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[var(--input-bg)] text-[10px] text-[var(--text-muted)] font-semibold border border-[var(--border-color)]">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[10px] text-[var(--text-muted)] font-bold italic">No specialized skills defined</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Edit Controls */}
                                        <div className="shrink-0 flex items-center gap-2">
                                            {editingUser === userItem.email ? (
                                                <div className="bg-[var(--input-bg)] p-5 rounded-2xl border border-[var(--border-color)] space-y-4 w-full md:w-80 shadow-inner">
                                                    <div className="text-xs font-bold text-[var(--text-muted)] font-mono">EDITING USER</div>
                                                    
                                                    <div className="space-y-3">
                                                        <select
                                                            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] focus:outline-none focus:border-purple-650"
                                                            value={formData.role}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, role: e.target.value })
                                                            }
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="moderator">Moderator</option>
                                                            <option value="admin">Admin</option>
                                                        </select>

                                                        <input
                                                            type="text"
                                                            placeholder="e.g. React, Node.js"
                                                            className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs text-[var(--text-color)] placeholder-slate-400 focus:outline-none focus:border-purple-650"
                                                            value={formData.skills}
                                                            onChange={(e) =>
                                                                setFormData({ ...formData, skills: e.target.value })
                                                            }
                                                        />
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-xs font-bold text-white dark:text-slate-900 transition shadow-sm"
                                                            onClick={handleUpdate}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="px-3.5 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-[var(--text-color)] transition shadow-sm"
                                                            onClick={() => setEditingUser(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    className="px-4 py-2 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] hover:border-purple-500/50 text-[var(--text-color)] text-xs font-bold transition shadow-sm"
                                                    onClick={() => handleEditClick(userItem)}
                                                >
                                                    Modify Profile
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Admin;