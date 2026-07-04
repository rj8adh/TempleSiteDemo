import { Flame, Users, BookOpen, Quote } from "lucide-react";
import PageHeader from "../components/PageHeader";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
    { value: "2+",    label: "Years of Service"  },
    { value: "15,000+", label: "People Served"    },
    { value: "20+",   label: "Annual Ceremonies"  },
];
import PashupatinathTemple from "../assets/pashupatinath-is-the.jpg"



// ─── Our Story ────────────────────────────────────────────────────────────────

function OurStory() {
    return (
        <section className="bg-parchment px-4 pt-28 pb-20 border-b border-border">
            <div className="max-w-3xl mx-auto">

                <PageHeader
                    badge="Est. 2024 · Our History"
                    title="About Our Temple"
                    subtitle="A sacred space of worship, culture, and community in the Greater Austin area."
                    className="mb-10"
                />

                <div className="space-y-5 text-foreground/75 text-[1.0625rem] leading-[1.85] text-center">
                    <p>
                        Founded by the Greater Austin Nepali Society, Pashupatinath US was built as an authentic replica of the Pashupatinath Temple is Kathumandu, Nepal. Since its creation, the temple has grown
                        into a vibrant spiritual and cultural center. 
                    </p>
                </div>

                <div className="my-10 flex flex-col items-center gap-4 text-center">
                    <Quote size={32} className="text-primary/30" />
                    <p className="font-heading text-xl md:text-2xl italic text-foreground/70 leading-relaxed max-w-xl">
                        "Quote statement coming soon..."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-primary/40" />
                        <p className="text-muted-foreground text-xs tracking-widest uppercase">Temple Mission</p>
                        <div className="w-8 h-px bg-primary/40" />
                    </div>
                </div>

                <div className="space-y-5 text-foreground/75 text-[1.0625rem] leading-[1.85] text-center">
                    <p>
                        Mission statement coming soon...
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-16">
                <div className="rounded-2xl overflow-hidden ring-1 ring-border shadow-lg aspect-video">
                    <img
                        src={PashupatinathTemple}
                        alt="Pashupatinath Temple, Kathmandu, Nepal"
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3 tracking-wider uppercase">
                    Pashupatinath Temple · Kathmandu, Nepal
                </p>
            </div>
        </section>
    );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsStrip() {
    return (
        <section className="bg-background px-4 py-16 border-b border-border">
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-3 divide-x divide-border">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="text-center px-4 py-2">
                            <p className="font-heading text-4xl md:text-5xl font-bold text-primary leading-none">
                                {value}
                            </p>
                            <p className="text-muted-foreground text-xs uppercase tracking-wider mt-3">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Our Values ───────────────────────────────────────────────────────────────


// ─── Page ─────────────────────────────────────────────────────────────────────

const AboutPage = () => (
    <div className="bg-parchment">
        <OurStory />
        <StatsStrip />
    </div>
);

export default AboutPage;
