import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: "", password: "" })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.findUser))
                navigate("/")
            }
            else {
                alert(data.error || data.message || "Login failed")
            }

        } catch (error) {
            console.error("Error occurred in Login: ", error.message)
            alert("An error occurred during login. Please try again.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden relative px-4 font-sans transition-colors duration-300">
            
            {/* Background Glows */}
            <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-md relative">
                
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="font-extrabold text-2xl tracking-tight text-[var(--text-color)]">
                        Welcome back
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1.5 font-medium">Log in to enter your agent workspace</p>
                </div>

                {/* Light/Dark Theme Card */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-8 shadow-[0_15px_50px_var(--shadow-color)] relative">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-color)] placeholder-slate-455 focus:outline-none focus:border-purple-650 transition duration-205"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-color)] placeholder-slate-455 focus:outline-none focus:border-purple-650 transition duration-205"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold shadow-md shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:-translate-y-0 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Enter Workspace"}
                        </button>
                    </form>
                </div>

                {/* Footer text */}
                <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-semibold">
                    New to TicketAI?{" "}
                    <Link to="/signup" className="text-purple-650 hover:text-purple-750 font-bold transition">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login