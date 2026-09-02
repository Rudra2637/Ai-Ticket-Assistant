import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
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

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="w-full glassmorphism px-6 py-4 flex items-center justify-between border-b border-slate-800/80 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
                        TicketAI
                    </span>
                </Link>
            </div>
            
            <div className="flex items-center gap-4">
                {!token ? (
                    <>
                        <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-slate-100 transition">
                            Sign In
                        </Link>
                        <Link to="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-bold shadow-lg shadow-purple-500/10 hover:opacity-95 transition">
                            Get Started
                        </Link>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col text-right hidden sm:flex">
                            <span className="text-xs text-slate-300 font-bold">{user?.email}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">
                                {user?.role || "User"}
                            </span>
                        </div>
                        
                        {user && user?.role === "admin" && (
                            <Link to="/admin" className="px-3.5 py-1.5 rounded-lg border border-purple-800/40 bg-purple-950/30 text-purple-400 text-xs font-semibold hover:bg-purple-950/50 transition">
                                Admin Dashboard
                            </Link>
                        )}
                        
                        <button 
                            onClick={logout} 
                            className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}