import bgImage from "../assets/IMG_6998.jpg";
import { Clock, MapPin } from "lucide-react"

const MAPS_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4095.912811651008!2d-97.56501932391711!3d30.496120397028605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8644db0039e6bc53%3A0xc000e7be52c07e35!2sPashupatinath%20Temple!5e1!3m2!1sen!2sus!4v1779897089973!5m2!1sen!2sus"
const MAPS_LINK = "https://maps.app.goo.gl/qDDcbVjHEEwUAaNo6";

// ─── Hero ─────────────────────────────────────────────────────────────────────

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Pashupatinath Temple" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/55" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                    <br />
                    Pashupatinath US <br />
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-white/90 font-medium leading-relaxed tracking-wide italic">
                    "USA's most authentic replica of the Pashupatinath Temple"
                </p>
                
                {/* 1. Moved the orange line up here and added mb-4 */}
                <div className="mt-8 mb-4 w-24 h-1 bg-primary rounded-full shadow-lg" />
                
                {/* 2. Added mt-10 to the button to give it more space */}
                <a 
                    href="#visit" 
                    className="mt-6 group flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-primary text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-xl"
                >
                    <Clock size={18} className="group-hover:animate-pulse" />
                    Hours and Location
                    <MapPin size={18} />
                </a>
            </div>
        </section>
    );
}

// ─── Visit & Worship ──────────────────────────────────────────────────────────

function VisitAndWorship() {
    return (
        <>
            {/* ─── SECTION 1: VIDEOS (Old Color) ─── */}
            <section className="bg-parchment px-4 py-20 scroll-mt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            Videos of the Temple
                        </h2>
                        <div className="mt-4 mx-auto w-12 h-0.5 bg-primary rounded-full" />
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-2xl overflow-hidden ring-1 ring-border shadow-lg bg-black aspect-video">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/O17wZMtAiSk" 
                                title="Drone video Shree Pashupatinath Temple"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        <div className="rounded-2xl overflow-hidden ring-1 ring-border shadow-lg bg-black aspect-video">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/TRt0S38lHCE" 
                                title="Pashupatinath Temple Austin TX"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── SECTION 2: HOURS & LOCATION (New White Color) ─── */}
            {/* The 'border-t' adds the thin line that spans the whole screen */}
            <section id="visit" className="bg-stone-50/50 border-t border-border/60 px-4 py-20 scroll-mt-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            Hours and Location
                        </h2>
                        <div className="mt-4 mx-auto w-12 h-0.5 bg-primary rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
                        <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0">
                            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Morning Hours</p>
                            <p className="font-heading text-3xl font-bold text-foreground">8:00 AM</p>
                            <p className="text-muted-foreground text-sm mt-1">to</p>
                            <p className="font-heading text-3xl font-bold text-foreground">10:00 PM</p>
                        </div>

                        <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0">
                            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Evening Hours</p>
                            <p className="font-heading text-3xl font-bold text-foreground">5:00 PM</p>
                            <p className="text-muted-foreground text-sm mt-1">to</p>
                            <p className="font-heading text-3xl font-bold text-foreground">8:00 PM</p>
                        </div>

                        <div className="flex flex-col items-center text-center px-6 py-6 sm:py-0">
                            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">Location</p>
                            <p className="font-heading text-xl font-bold text-foreground leading-snug">Pashupatinath<br />US Temple</p>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">1251 Co Rd 138<br />Hutto, TX 78634</p>
                            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">
                                View on Google Maps →
                            </a>
                        </div>
                    </div>

                    <div className="mt-14 rounded-2xl overflow-hidden ring-1 ring-border shadow-sm h-[380px]">
                        <iframe title="Temple Location" src={MAPS_EMBED} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                    </div>
                </div>
            </section>
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage = () => (
    <div>
        <Hero />
        <VisitAndWorship />
    </div>
);

export default HomePage;