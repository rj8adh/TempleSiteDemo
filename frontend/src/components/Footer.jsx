import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Globe, Video, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import logo from "../assets/logo.png"

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_COLS = [
    {
        heading: "Explore",
        links: [
            { to: "/",            label: "Home"        },
            { to: "/about",       label: "About Us"    },
            { to: "/services",    label: "Services"    },
            { to: "/events",      label: "Events"      },
            { to: "/contact",     label: "Contact"     },
            { to: "/learn-more",  label: "Learn" },
        ],
    },
    {
        heading: "My Account",
        links: [
            { to: "/my-family",  label: "My Family" },
            { to: "/orders",      label: "My Orders"     },
            { to: "/cart",      label: "My Cart"     },
        ],
    },
];

const CONTACT_ROWS = [
    { icon: MapPin,  text: "1251 Co Rd 138, Hutto, TX 78634" },
    { icon: Phone,   text: "+1 512-554-3961"                        },
    { icon: Mail,    text: "greateraustinnepalisociety@gmail.com"                  },
    { icon: Clock,   text: "Daily: 8 AM – 10 AM · 5 PM – 8 PM"       },
];

const SOCIAL = [
    { icon: Globe,          label: "Facebook Page",   href: "https://www.facebook.com/OurGANS/" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Footer = () => (
    <footer className="bg-parchment border-t border-border">
        {/* Main grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-4">
                <Link to="/" className="flex items-center gap-2.5">
                <div className="bg-white rounded-lg flex items-center justify-center h-12 w-16 sm:h-14 sm:w-20 p-0.75 shadow-sm overflow-hidden">
                    <img 
                        src={logo} 
                        alt="Logo" 
                        className="h-[110%] w-full object-contain scale-125" 
                    />
                </div>
                    <span className="font-heading text-base font-bold text-foreground leading-none">
                        Pashupatinath US
                    </span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                    The most authentic and architecturally accurate replica of the Pashupatinath Temple in Kathmandu, Nepal.
                </p>
                {/* Social icons */}
                <div className="flex items-center gap-2 pt-1">
                    {SOCIAL.map(({ icon: Icon, label, href }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="w-8 h-8 flex items-center justify-center rounded-lg ring-1 ring-border text-muted-foreground hover:text-primary hover:ring-primary/40 transition-colors"
                        >
                            <Icon size={14} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Nav columns */}
            {NAV_COLS.map((col) => (
                <div key={col.heading} className="space-y-4">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-[0.15em]">
                        {col.heading}
                    </p>
                    <ul className="space-y-2.5">
                        {col.links.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}

            {/* Contact column */}
            <div className="space-y-4">
                <p className="text-xs font-semibold text-foreground uppercase tracking-[0.15em]">
                    Visit Us
                </p>
                <ul className="space-y-3">
                    {CONTACT_ROWS.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-2.5">
                            <Icon size={13} className="text-primary shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground leading-snug">{text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <Separator />

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
    <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pashupatinath US Temple. All rights reserved.
    </p>
    <div className="flex items-center gap-4">
        {/* Map through the links and use the Link component */}
        <Link
            to="/privacy-policy"
            className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
            Privacy Policy
        </Link>
        <Link
            to="/terms-of-service"
            className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
            Terms of Service
        </Link>
    </div>
</div>
    </footer>
);

export default Footer;
