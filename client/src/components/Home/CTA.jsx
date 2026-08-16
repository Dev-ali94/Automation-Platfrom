import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20" style={{ background: "#0A0A0E" }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div
                    className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center"
                    style={{
                        background: "#18181B" ,
                        border: "1px solid #27272A"}}>
                    
                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/15 text-orange-500 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">Ready to grow?</div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-medium text-zinc-100">
                            Automate your social
                            <br />
                            <span className="text-orange-400 italic">media today</span>
                        </h2>
                        <p className="mt-6 text-zinc-400 max-w-lg mx-auto  text-lg">Join thousands of creators and marketers who trust Scheduler to grow their audience on autopilot.</p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to="/login" className="bg-orange-500/15 rounded-full text-orange-400 hover:text-zinc-100 border border-orange-500/30 hover:bg-orange-500 group inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center">
                                Get Started Free <ArrowRightIcon className="size-4 group-hover:text-zinc-100" />
                            </Link>
                            <a href="#pricing" className="bg-zinc-800  text-zinc-300 border-[1.5px] border-zinc-600 rounded-full font-medium hover:bg-zinc-900/40 hover:border-zinc-500 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center">
                                View Pricing
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-zinc-500">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
