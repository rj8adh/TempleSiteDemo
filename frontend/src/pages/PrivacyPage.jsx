import { Link } from "react-router-dom";

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-parchment pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-sm border border-stone-200">
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground mb-8">Last Updated: May 28, 2026</p>

                <section className="space-y-8 text-stone-800 leading-relaxed">

                    {/* 1. Introduction */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
                        <p>
                            Welcome to Pashupatinath US Temple ("we," "our," or "us"). We are a
                            nonprofit religious organization dedicated to serving the Nepali community.
                            We respect your privacy and are committed to protecting your personal data.
                            This policy explains how we collect, use, and safeguard information when
                            you use our website and services.
                        </p>
                    </div>

                    {/* 2. Google OAuth */}
                    <div className="bg-primary/5 p-5 rounded-xl border border-primary/15">
                        <h2 className="text-xl font-bold mb-3 text-primary">2. Google OAuth Data Usage</h2>
                        <p className="mb-3">
                            When you sign in using your Google Account, we access only the following
                            information with your consent:
                        </p>
                        <ul className="list-disc ml-6 space-y-1.5 mb-4">
                            <li>
                                <strong>Your Name:</strong> Used to personalize your account profile
                                and booking records.
                            </li>
                            <li>
                                <strong>Your Email Address:</strong> Used as your unique account
                                identifier and for booking confirmations.
                            </li>
                        </ul>
                        <p className="text-sm text-stone-700 italic mb-3">
                            We do not share your Google data with third parties, nor do we use it
                            for advertising or marketing purposes.
                        </p>
                        <p className="text-sm font-medium text-primary border-t border-primary/15 pt-3">
                            Our use of information received from Google APIs will adhere to the{" "}
                            <a
                                href="https://developers.google.com/terms/api-services-user-data-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-2 hover:text-primary/80"
                            >
                                Google API Services User Data Policy
                            </a>
                            , including the Limited Use requirements.
                        </p>
                    </div>

                    {/* 3. Information Collection */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">3. Information We Collect</h2>
                        <p className="mb-2">
                            We collect information you provide directly to us, including:
                        </p>
                        <ul className="list-disc ml-6 space-y-1.5">
                            <li>Account registration details (name, email, password)</li>
                            <li>
                                Ritual information voluntarily provided for service bookings (Gotra,
                                Rashi, birthday) — used solely to perform the requested ceremony
                            </li>
                            <li>
                                Family member details added to your Family Circle — stored to make
                                future bookings more convenient
                            </li>
                            <li>
                                Transaction records (services booked, amounts, dates) — retained for
                                nonprofit financial recordkeeping and tax compliance
                            </li>
                        </ul>
                    </div>

                    {/* 4. Data Deletion */}
                    <div className="bg-amber-50/60 p-5 rounded-xl border border-amber-200">
                        <h2 className="text-xl font-bold mb-2">4. Data Deletion &amp; Account Removal</h2>
                        <p className="mb-3">
                            You may permanently delete your account and all associated personal data
                            at any time via the{" "}
                            <Link to="/settings" className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
                                Settings page
                            </Link>
                            .
                        </p>
                        <p className="text-sm text-stone-700">
                            Upon deletion, your name, email, password, profile details, and Family
                            Circle are removed immediately and irreversibly. However, anonymized
                            transaction records (service type, date, and amount) will be retained
                            for nonprofit tax reporting and audit purposes as required by law (IRS
                            regulations for 501(c)(3) organizations). These retained records contain
                            no personally identifiable information.
                        </p>
                    </div>

                    {/* 5. Data Security */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">5. Data Security</h2>
                        <p>
                            We implement industry-standard security measures — including encrypted
                            authentication tokens, HTTP-only cookies, and secure HTTPS connections —
                            to protect your data against unauthorized access, disclosure, or
                            alteration. Access to your personal information is restricted to
                            authorized personnel only.
                        </p>
                    </div>

                    {/* 6. Third-Party Services */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">6. Third-Party Services</h2>
                        <p>
                            We use Zelle for payment processing. Payments are made directly through
                            your bank's Zelle interface and are not processed or stored on our
                            servers. We do not have access to your banking credentials or payment
                            instrument details.
                        </p>
                    </div>

                    {/* 7. Contact */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">7. Contact Us</h2>
                        <p className="mb-3">
                            If you have questions, concerns, or requests regarding this Privacy
                            Policy or your personal data, please contact us:
                        </p>
                        <div className="bg-stone-50 rounded-xl border border-stone-200 px-5 py-4 space-y-1 text-sm">
                            <p className="font-semibold text-foreground">Pashupatinath US Temple</p>
                            <p className="text-muted-foreground">1251 Co Rd 138, Hutto, TX 78634</p>
                            <p>
                                <a
                                    href="mailto:greateraustinnepalisociety@gmail.com"
                                    className="text-primary font-medium hover:underline"
                                >
                                    greateraustinnepalisociety@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
