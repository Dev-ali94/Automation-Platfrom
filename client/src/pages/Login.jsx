import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";

export default function Login() {
    const [loginState, setLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0E] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900 rounded-2xl shadow-sm p-8">
                    <div className="flex flex-col items-center mb-8">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Logo" className="size-6.5" />
                            <h1 className="text-2xl text-zinc-100">Scheduler</h1>
                        </Link>
                        <p className="text-zinc-400 text-sm mt-1">Sign in to your Dashboard</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                        {!loginState && (
                            <div>
                                <label className="block mb-1.5 text-zinc-100">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute  left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                                   <input type="text" required placeholder="Enter your name"
                                    className="w-full pl-10 pr-5 py-2.5 focus:outline-none border border-zinc-700 focus:border-orange-500 text-zinc-200 rounded-full placeholder:text-zinc-300" 
                                    value={name}onChange={(e) => setName(e.target.value)}/>
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-1.5 text-zinc-100">Email</label>
                            <div className="relative">
                                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                                <input type="email" required placeholder="you@company.com" 
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 focus:outline-none outline-none focus:border-orange-500 placeholder:text-zinc-300 text-zinc-200 border border-zinc-700 rounded-full" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-1.5 text-zinc-200">Password</label>
                            <div className="relative">
                                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                                <input type="password" required placeholder="********" className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 focus:outline-none outline-none focus:border-orange-500 placeholder:text-zinc-300 text-zinc-200 border border-zinc-700 rounded-full" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-2.5 px-4 hover:bg-orange-500 hover:text-white bg-orange-500/15 text-orange-400 border border-orange-500/80 rounded-full text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    {loginState ? "Sign In" : "Sign Up"} <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-zinc-400">
                        {loginState ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setLoginState(false)} className="text-orange-400 hover:text-orange-500">
                                    Create one free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setLoginState(true)} className="text-orange-400 hover:text-orange-500">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
