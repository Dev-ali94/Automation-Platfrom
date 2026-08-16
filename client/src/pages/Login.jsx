import { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext'
import axios from "axios";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon } from "lucide-react";

export default function Login() {
 const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext)
    const [loginState, setLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        axios.defaults.withCredentials = true;

        let data;

        if (!loginState) {
            // REGISTER
            ({ data } = await axios.post(
                `${backendUrl}/api/auth/register`,
                {
                    name,
                    email,
                    password,
                }
            ));
        } else {
            // LOGIN
            ({ data } = await axios.post(
                `${backendUrl}/api/auth/login`,
                {
                    email,
                    password,
                }
            ));
        }

        if (data.success) {
            setIsLoggedIn(true);

            await getUserData();

            // Your registration response doesn't currently
            // return userData, so don't rely on data.userData here.
            if (!loginState) {
                navigate("/verify-email");
            } else {
                navigate("/");
            }
        } else {
            console.error(data.message);
        }
    } catch (error) {
        console.error(
            error.response?.data?.message || error.message
        );
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="min-h-screen bg-[#0A0A0E] flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm p-8">
                    <div className="text-center mb-6">
                        {loginState ? (
                            <>
                                <h2 className="text-xl font-semibold uppercase text-zinc-100">
                                    Welcome Back
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1">
                                    Sign in to continue to your account
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold uppercase text-zinc-100">
                                    Let’s get started
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1">
                                    Create an account to access all features
                                </p>
                            </>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                        {!loginState && (
                            <div>
                                <label className="block mb-1.5 text-zinc-100">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute  left-3.5 top-1/2 -translate-y-1/2 text-orange-400" />
                                    <input type="text" required placeholder="Enter your name"
                                        className="w-full pl-10 pr-5 py-2.5 focus:outline-none border border-zinc-700 focus:border-orange-500 text-zinc-200 rounded-full placeholder:text-zinc-300"
                                        value={name} onChange={(e) => setName(e.target.value)} />
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
                        {loginState && (
                            <p
                                onClick={() => navigate("/reset-password")}
                                className="text-zinc-100  text-xs cursor-pointer "
                            >
                                If you forgot your password, you can
                                <span className="text-orange-400 capitalize text-sm font-semibold hover:text-orange-500 ml-1">Reset it !</span>

                            </p>
                        )}



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
