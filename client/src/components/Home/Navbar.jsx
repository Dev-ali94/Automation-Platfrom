import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function Navbar() {
    const { user } = { user: false };

    return (
        <nav className="sticky top-0 z-50 bg-[#0A0A0E] backdrop-blur-lg border-b border-zinc-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2 ">
                    <img src="/logo.svg" alt="logo" className="size-7" />
                    <span className="text-xl lg:text-2xl font-medium font-serif text-zinc-100">Scheduler</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-zinc-200">
                    <a href="#features" className="hover:text-orange-400">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-orange-400">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-orange-400">
                        Pricing
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium bg-orange-500/10 hover:bg-orange-600 text-orange-500  px-4 py-2 rounded-full shadow-sm hover:shadow-orange-200 hover:shadow-md">
                        Go to Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm text-zinc-200 hover:text-orange-400 hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/login" className="flex items-center  gap-1.5 text-sm bg-orange-500/15  hover:bg-orange-500 text-orange-400 border border-orange-500/30 px-4 py-2 rounded-full shadow-sm hover:text-zinc-100 hover:border-zinc-800 hover:shadow-md">
                            Get Started <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
