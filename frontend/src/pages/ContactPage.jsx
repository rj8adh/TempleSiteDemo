import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Globe, Video, MessageCircle, Sparkles, Smartphone, ScrollText, Copy, Check} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
    { icon: Globe,          label: "Facebook Page",   href: "#" },
    { icon: Video,          label: "YouTube Channel", href: "#" },
    { icon: MessageCircle,  label: "WhatsApp Group",  href: "#" },
];

const DONATION_METHODS = [
    {
        icon: Smartphone,
        label: "Zelle",
        rows: [
            { key: "Send to", value: "greateraustinnepalisociety@gmail.com" },
            { key: "Account Name", value: "Pashupatinath US Temple" },
        ],
        note: "Open your banking app, select Zelle, and search for the email above.",
    },
    {
        icon: ScrollText,
        label: "Check or Cash",
        rows: [
            { key: "Payable to", value: "Greater Austin Nepali Society" },
            { key: "Bring to", value: "1251 Co Rd 138, Hutto, TX 78634" },
        ],
        note: "Write your name and 'Temple Donation' on the memo line.",
    },
];

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);
    const handle = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    };
    return (
        <button
            onClick={handle}
            aria-label={`Copy ${text}`}
            className="ml-1.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
        >
            {copied
                ? <Check size={12} className="text-primary" />
                : <Copy size={12} />
            }
        </button>
    );
}

// ─── Reach Us ─────────────────────────────────────────────────────────────────

function ReachUs() {
    return (
        <section className="bg-parchment px-4 pt-28 pb-20 border-b border-border">
            <div className="max-w-5xl mx-auto">

                <PageHeader
                    badge="Contact & Hours"
                    title="Reach Us"
                    subtitle="Visit us in person, reach out by phone or email, or connect on social media."
                    className="mb-14"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">

                    {/* Address */}
                    <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0 gap-2">
                        <MapPin size={20} className="text-primary mb-1" />
                        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Address</p>
                        <p className="text-sm text-foreground leading-relaxed">
                            1251 Co Rd 138<br />Hutto, TX 78634
                        </p>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=1251+Co+Rd+138+Hutto+TX+78634"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors mt-1"
                        >
                            View on Google Maps →
                        </a>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0 gap-3">
                        <Mail size={20} className="text-primary mb-1" />
                        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Get in Touch</p>
                        
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Phone</p>
                            <a href="tel:+15125543961" className="text-sm text-foreground hover:text-primary transition-colors">+1 512-554-3961</a>
                        </div>

                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                            <a href="mailto:greateraustinnepalisociety@gmail.com" className="text-sm text-foreground hover:text-primary transition-colors break-all">greateraustinnepalisociety@gmail.com</a>
                        </div>

                        {/* Grouped Label and Icon for tight spacing */}
                        <div className="flex flex-col items-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Facebook</p>
                            <div className="flex items-center justify-center pt-1">
                                <a
                                    href="https://www.facebook.com/OurGANS/" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg ring-1 ring-border text-muted-foreground hover:text-primary hover:ring-primary/40 transition-colors"
                                >
                                    <Globe size={14} /> 
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Priest Hours */}
                    <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0 gap-3">
                        <Clock size={20} className="text-primary mb-1" />
                        <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">Priest Hours</p>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Morning</p>
                            <p className="text-sm text-foreground">8:00 AM – 10:00 AM</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Evening</p>
                            <p className="text-sm text-foreground">5:00 PM – 8:00 PM</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-[160px]">
                            Available for puja bookings & enquiries
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Support the Temple ───────────────────────────────────────────────────────

function SupportTheTemple() {
    return (
        <section className="bg-background px-4 py-20">
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-14">
                    <Badge
                        variant="outline"
                        className="mb-4 border-primary/60 text-primary tracking-[0.25em] uppercase text-xs"
                    >
                        Donations &amp; Offerings
                    </Badge>
                    <h2 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4 leading-tight">
                        Support the Temple
                    </h2>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Your generosity keeps our sacred traditions alive. Every offering is received with gratitude.
                    </p>
                    <div className="mt-6 mx-auto w-16 h-0.5 bg-primary rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border max-w-3xl mx-auto">
                    {DONATION_METHODS.map(({ icon: Icon, label, rows, note }) => (
                        <div key={label} className="flex flex-col items-center text-center px-8 py-10 md:py-4 gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Icon size={24} className="text-primary" />
                                </div>
                                <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">{label}</p>
                            </div>
                            <div className="space-y-4 w-full">
                                {rows.map(({ key, value }) => (
                                    <div key={key}>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{key}</p>
                                        <div className="flex items-center justify-center gap-1">
                                            <p className="text-sm font-medium text-foreground break-all leading-snug">{value}</p>
                                            <CopyButton text={value} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[240px] mt-auto pt-4 border-t border-border w-full">
                                {note}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-muted-foreground text-center mt-16 leading-relaxed">
                    All donations support temple maintenance, festivals, and community programs.<br />
                </p>
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ContactPage = () => (
    <div className="bg-parchment min-h-screen">
        <ReachUs />
        <SupportTheTemple />
    </div>
);

export default ContactPage;