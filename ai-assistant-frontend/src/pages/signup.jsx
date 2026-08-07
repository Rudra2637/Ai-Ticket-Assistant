import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: "", password: "" })
    const [skills, setSkills] = useState([])
    const [currentSkill, setCurrentSkill] = useState("")

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const addSkill = (e) => {
        e.preventDefault()
        const trimmed = currentSkill.trim()
        if (trimmed && !skills.includes(trimmed)) {
            setSkills([...skills, trimmed])
            setCurrentSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        setSkills(skills.filter((_, idx) => idx !== indexToRemove))
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                    skills: skills
                })
            })
            const data = await res.json()

            if (res.ok) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.createdUser))
                navigate("/")
            }
            else {
                alert(data.message || "Signup failed")
            }

        } catch (error) {
            console.error("Error occurred in signUp: ", error.message)
            alert("Signup failed. Please try again.")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden relative px-4 py-12 font-sans transition-colors duration-300">
            
            {/* Background Glows */}
            <div className="absolute top-[10%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] -z-10 animate-pulse-slow"></div>
            <div className="absolute bottom-[10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[120px] -z-10 animate-pulse-slow"></div>

            <div className="w-full max-w-md relative">
                
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <h1 className="font-extrabold text-2xl tracking-tight text-[var(--text-color)]">
                        Create Account
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1.5 font-medium">Join TicketAI & experience automated AI triage</p>
                </div>

                {/* Light/Dark Theme Card */}
                <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-8 shadow-[0_15px_50px_var(--shadow-color)] relative">
                    <form onSubmit={handleSignup} className="space-y-5">
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

                        {/* Optional Skill tags */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                                Your Skills (Optional)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. React, MongoDB"
                                    className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-color)] placeholder-slate-455 focus:outline-none focus:border-purple-650 transition"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkill(e);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-[var(--border-color)] rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition"
                                >
                                    Add
                                </button>
                            </div>
                            
                            {/* Skills Tag List */}
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {skills.map((skill, idx) => (
                                        <span 
                                            key={idx} 
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-color)] text-xs font-semibold"
                                        >
                                            {skill}
                                            <button 
                                                type="button" 
                                                onClick={() => removeSkill(idx)} 
                                                className="hover:text-red-500 transition text-[14px]"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-[10px] text-[var(--text-muted)] mt-1.5 font-medium leading-normal">
                                Adding skills allows the Ticket AI router to match relevant tickets directly to you.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold shadow-md shadow-slate-950/10 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:-translate-y-0 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                </div>

                {/* Footer text */}
                <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-semibold">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-650 hover:text-purple-755 font-bold transition">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup