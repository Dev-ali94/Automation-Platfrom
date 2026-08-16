import { StarIcon } from "lucide-react";

const testimonials = [
    {
        name: "Sarah K.",
        role: "Marketing Manager",
        avatar: "S",
        avatarBg: "from-red-400 to-pink-400",
        text: "Scheduler has saved our team 10+ hours a week. The AI composer is genuinely impressive — it writes content that sounds like us.",
    },
    {
        name: "Marcus L.",
        role: "Indie Creator",
        avatar: "M",
        avatarBg: "from-violet-400 to-purple-500",
        text: "I used to dread posting. Now I queue up a whole week of content in 20 minutes. The smart scheduling feature alone is worth it.",
    },
    {
        name: "Priya D.",
        role: "Startup Founder",
        avatar: "P",
        avatarBg: "from-sky-400 to-blue-500",
        text: "Finally a scheduler that's beautiful AND powerful. The clean dashboard makes it easy to see exactly what's going out and when.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#0A0A0E]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/15 text-orange-500 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <StarIcon className="size-3 " />
                        Testimonials
                    </div>
                    <h2 className="font-serif font-medium text-4xl sm:text-5xl leading-tight text-zinc-100">
                        Loved by <span className="text-orange-400 ">creators &amp; teams</span>
                    </h2>
                    <p className="mt-5 text-zinc-400 max-w-md mx-auto">Join thousands of people who automate their social media with Scheduler.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800  hover:shadow-lg hover:shadow-zinc-900/80 p-6 transition-all flex flex-col gap-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
                                <div className={`size-9 rounded-full bg-linear-to-br ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{t.avatar}</div>
                                <div>
                                    <div className="text-sm font-medium text-zinc-100">{t.name}</div>
                                    <div className="text-xs text-zinc-400">{t.role}</div>
                                </div>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed flex-1">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
