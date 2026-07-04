import { Link } from "react-router-dom";

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-parchment pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-stone-200">
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
                <p className="text-sm text-muted-foreground mb-8">Last Updated: May 28, 2026</p>

                <section className="space-y-8 text-stone-800 leading-relaxed">

                    {/* 1. Acceptance */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Pashupatinath US Temple website, you agree to
                            be bound by these Terms of Service. If you do not agree, please refrain
                            from using our site. We invite all members of our community to engage
                            with us in a spirit of mutual respect and goodwill.
                        </p>
                    </div>

                    {/* 2. Services */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">2. Services Provided</h2>
                        <p>
                            This website provides ritual booking services, event information, and
                            community resources for the Nepali Hindu community in the greater Austin
                            area and beyond. Services are offered as a convenience to the community
                            and are subject to priest and temple availability.
                        </p>
                    </div>

                    {/* 3. User Accounts */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">3. User Accounts</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account
                            credentials and for all activity that occurs under your account. Please
                            notify us immediately at{" "}
                            <a
                                href="mailto:greateraustinnepalisociety@gmail.com"
                                className="text-primary font-medium hover:underline"
                            >
                                greateraustinnepalisociety@gmail.com
                            </a>{" "}
                            if you believe your account has been compromised. You may delete your
                            account at any time via the{" "}
                            <Link to="/settings" className="text-primary font-medium hover:underline">
                                Settings page
                            </Link>
                            .
                        </p>
                    </div>

                    {/* 4. Payments */}
                    <div className="bg-primary/5 p-5 rounded-xl border border-primary/15">
                        <h2 className="text-xl font-bold mb-2">4. Payments &amp; Bookings</h2>
                        <p className="mb-3">
                            Bookings are confirmed and recorded upon successful payment verification
                            by our team. As this is a volunteer-run nonprofit organization, all fees
                            collected support the ongoing operations, maintenance, and ritual
                            activities of the temple — no funds are used for personal gain.
                        </p>
                        <p className="text-sm text-stone-700 italic">
                            All bookings are final and non-refundable. Sacred offerings are prepared
                            personally by the Guru and cannot be cancelled once confirmed.
                        </p>
                    </div>

                    {/* 5. Limitation of Liability */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">5. Limitation of Liability</h2>
                        <p>
                            Pashupatinath US Temple shall not be liable for any indirect, incidental,
                            or consequential damages arising from your use of this website or any
                            service interruptions beyond our reasonable control. Our total liability
                            for any claim shall not exceed the amount paid by you for the specific
                            service in question.
                        </p>
                    </div>

                    {/* 6. Changes to Terms */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">6. Changes to These Terms</h2>
                        <p>
                            As our community and organization grow, we reserve the right to update
                            these Terms of Service at any time. Changes will be reflected by an
                            updated "Last Updated" date at the top of this page. Continued use of
                            the site after any changes constitutes your acceptance of the revised
                            terms. We will make reasonable efforts to notify users of significant
                            changes.
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">7. Contact</h2>
                        <p className="mb-3">
                            Questions about these terms? We're happy to help.
                        </p>
                        <div className="bg-stone-50 rounded-xl border border-stone-200 px-5 py-4 space-y-1 text-sm">
                            <p className="font-semibold text-foreground">Pashupatinath US Temple</p>
                            <p className="text-muted-foreground">1251 Co Rd 138, Hutto, TX 78634</p>
                            <a
                                href="mailto:greateraustinnepalisociety@gmail.com"
                                className="block text-primary font-medium hover:underline"
                            >
                                greateraustinnepalisociety@gmail.com
                            </a>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default TermsPage;
