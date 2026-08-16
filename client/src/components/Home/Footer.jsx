import { Link } from "react-router-dom";

const footerLinks = {
    Product: ["Features", "How it works", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
    return (
        <footer style={{ background: "#0A0A0E", borderTop: "1px solid #27272A" }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" onClick={() => scrollTo(0, 0)} className="inline-flex items-center gap-2 mb-5">
                            <img src="/logo.svg" alt="logo" className="size-6" />
                            <span className="font-medium font-serif text-xl text-zinc-100">Scheduler</span>
                        </Link>
                        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">The AI-powered social media scheduler that helps creators and teams grow faster with less effort.</p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <div className="text-xs font-semibold uppercase tracking-widest mb-5 text-zinc-200">{category}</div>
                            <ul className="space-y-1">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-zinc-300 hover:text-orange-400">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>
                    <p className="text-xs text-zinc-400">© {new Date().getFullYear()} Scheduler. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-xs text-zinc-400 hover:text-orange-400">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-xs text-zinc-400 hover:text-orange-400">
                            Terms of Service
                        </a>
                        <Link to="/login" className="text-xs text-zinc-400 hover:text-orange-400">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
