import { Link } from "react-router-dom";
import { ArrowRightIcon, DotIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="bg-[#0A0A0E] bg-size-[56px_56px]">
            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-sm px-3.5 py-1.5 rounded-full mb-8">
                    <span className="size-1.5 bg-orange-500 rounded-full" />
                    AI-Powered Social Media Automation
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-zinc-100">
                    Schedule smarter.
                    <br />
                    <span className="text-orange-400 italic">Grow faster.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-7 text-zinc-400 max-w-2xl mx-auto">
                    Scheduler lets you create, schedule, and auto-engage across all
                    your social platforms — powered by AI that writes your captions
                    and replies for you.
                </p>

                {/* CTAs */}
                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                    {/* Start for free */}
                    <Link
                        to="/login"
                        className="
                            group
                            bg-orange-500/10
                            text-orange-400
                            border border-orange-500/30
                            hover:bg-orange-500
                            hover:text-white
                            hover:border-orange-500
                            rounded-full
                            font-medium
                            inline-flex
                            items-center
                            gap-2
                            text-[15px]
                            px-8
                            py-3.5
                            w-full
                            sm:w-auto
                            justify-center
                            transition-all
                            duration-300
                        "
                    >
                        Start for free

                        <ArrowRightIcon
                            className="
                                size-4
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
                    </Link>

                    {/* See how it works */}
                    <a
                        href="#how-it-works"
                        className="
                            bg-zinc-900
                            text-zinc-100
                            border-[1.5px]
                            border-zinc-800
                            hover:bg-zinc-800
                            hover:border-zinc-700
                            hover:text-white
                            rounded-full
                            font-medium
                            inline-flex
                            items-center
                            gap-2
                            text-[15px]
                            px-8
                            py-3.5
                            w-full
                            sm:w-auto
                            justify-center
                            transition-all
                            duration-300
                        "
                    >
                        See how it works
                    </a>
                </div>

                {/* Small text */}
                <p className="mt-5 text-xs text-zinc-400">
                    No credit card required · Free forever plan available
                </p>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-0">
                <div className="rounded-2xl overflow-hidden border border-zinc-800 border-b-0">
                    {/* Browser Chrome */}
                    <div
                        className="flex items-center gap-2 px-4 py-3"
                        style={{
                            background: "#18181B",
                            borderBottom: "1px solid #3F3F46",
                        }}
                    >
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />

                        <div className="flex-1 mx-4 rounded-md h-5 max-w-xs bg-zinc-800" />
                    </div>

                    {/* Mock Content */}
                    <div
                        className="p-6"
                        style={{ background: "#18181B" }}
                    >
                        {/* Stat Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                {
                                    val: "12",
                                    label: "Scheduled",
                                },
                                {
                                    val: "48",
                                    label: "Published",
                                },
                                {
                                    val: "4",
                                    label: "Accounts",
                                },
                                {
                                    val: "3",
                                    label: "AI Rules",
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-xl p-4 bg-zinc-800"
                                    style={{
                                        border: "1px solid #3F3F46",
                                    }}
                                >
                                    <div className="text-2xl font-bold text-zinc-100 tabular-nums">
                                        {s.val}
                                    </div>

                                    <div className="text-xs text-zinc-400 mt-1">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Activity List */}
                        <div
                            className="rounded-xl p-4 space-y-3 bg-zinc-800"
                            style={{
                                border: "1px solid #3F3F46",
                            }}
                        >
                            <div className="text-[10px] font-semibold text-zinc-100 uppercase tracking-widest mb-3">
                                Recent Activity
                            </div>

                            {[
                                {
                                    text: "Post published to LinkedIn & Twitter",
                                    time: "2m ago",
                                },
                                {
                                    text: "AI replied to 3 comments",
                                    time: "15m ago",
                                },
                                {
                                    text: "New post scheduled for tomorrow 9am",
                                    time: "1h ago",
                                },
                            ].map((item) => (
                                <div
                                    key={item.text}
                                    className="flex items-center gap-3"
                                >
                                    <DotIcon className="size-5 text-zinc-100" />

                                    <span className="text-sm text-zinc-300 flex-1">
                                        {item.text}
                                    </span>

                                    <span className="text-xs text-zinc-400 shrink-0">
                                        {item.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}