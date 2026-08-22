import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import SeoHead from '@/Components/SeoHead';

export default function PrivacyPolicy() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-black selection:text-brand-white">
            <SeoHead
                title="Privacy Policy | Island Residential"
                description="Privacy and data handling policy for Island Residential rental applications and tenant communications."
                path="/privacy-policy"
                robots="noindex, follow"
            />

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="animate-fade-in">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <Link href="/" className="group flex items-center text-xs font-bold tracking-[0.2em] animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <span className="transform transition-transform duration-300 group-hover:-translate-x-2 mr-2">←</span>
                        BACK
                    </Link>
                </div>
            </nav>

            <main className="pt-40 pb-32 px-6 md:px-12 max-w-4xl mx-auto">
                <div className="mb-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.1] animate-reveal">
                        Privacy &<br />
                        <span className="text-gray-400 font-light">Data Handling.</span>
                    </h1>
                    <div className="w-12 h-[3px] bg-brand-black mb-8 rounded-full"></div>
                    <div className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Last Updated: June 22, 2026</div>
                    <div className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2">Data Controller: Island Residential</div>
                    <div className="text-sm font-bold tracking-widest uppercase text-gray-500">Website: islandresidential.ca</div>
                </div>

                <div className="prose prose-lg prose-gray max-w-none space-y-8 text-brand-gray font-light leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    <p>
                        At Island Residential, we are committed to protecting the privacy and security of the personal information of our applicants and future tenants. This Privacy Policy explains how we collect, use, disclose, and safeguard your information in compliance with the Personal Information Protection and Electronic Documents Act (PIPEDA) of Canada.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Information We Collect</h2>
                    <p>
                        To properly evaluate rental applications, we collect personal information when you complete our application form. This includes identification and contact details such as your full name, date of birth, cell phone number, email address, current address, and a government-issued photo ID. We also collect occupation details including the number of occupants, presence of smokers or pets, and parking requirements. To assess your suitability as a tenant, we gather your rental history, reasons for moving, employment status, income details including co-applicant income, supporting documents like employment letters, paystubs, and credit checks, and declarations about whether you have ever filed for bankruptcy or a consumer proposal. Furthermore, we collect background information regarding vehicles and any criminal offense charges to determine if further background checks are required.
                    </p>
                    <p className="mt-4">
                        <strong>Partial Form Submissions:</strong> Please note that our application form saves partial data as a "draft" as you progress through the steps. This means we may collect and store the contact information you provide in the first section even if you do not complete the final submission, enabling us to assist you with your application process. Technical data regarding your website visit is also collected through the use of cookies.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Purpose of Collection</h2>
                    <p>
                        Island Residential collects your personal information exclusively to evaluate your financial viability and eligibility as a future tenant of our properties, financial viability or collection purposes should they be deemed necessary We also use this data to communicate with you to schedule property viewings, request additional information, or update you on your application status. We use your submitted documents to verify your identity and background for security purposes. We do not use your personal information to send newsletters, marketing emails, or unsolicited advertising.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Data Sharing & International Transfers</h2>
                    <p>
                        Your personal information is securely transmitted directly to the authorized owners and administrators of Island Residential for review. We do not sell or rent your personal information to third parties. Please be advised that our website and databases are hosted on servers located in the United States, and technical maintenance is provided by developers located in Colombia. Consequently, your personal information is transferred, stored, and processed outside of Canada. As a result, your data may be subject to the laws of those foreign jurisdictions, meaning that government or law enforcement authorities in the United States or Colombia could potentially access the information according to their local laws.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Data Retention</h2>
                    <p>
                        We will retain your personal information only for as long as necessary to fulfill the purposes for which it was collected. If your rental application is not approved, your information and all attached documents will be securely kept for a period of three years from the date of submission, after which they will be permanently deleted. If you are approved and become a tenant, your application information will be retained for the entire duration of your lease agreement and for an additional three years after you vacate the property, in order to comply with legal and administrative requirements.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Applicant Declarations & Consent</h2>
                    <p>
                        By submitting a rental application, you explicitly agree to the following declarations:
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>The Applicant(s) grant permission to contact the personal references listed above, both now and in the future for rental consideration or for collection purposes should they be deemed necessary.</li>
                            <li>The Applicant(s) grant permission to obtain and/or exchange personal or financial information from/with any personal information credit agency towards verifying or establishing my financial standing.</li>
                            <li>The Applicant(s) acknowledge and understand that personal information will be collected, processed, and stored for the purposes of now and future rental applications or for collections purposes should they be deemed necessary.</li>
                            <li>The Applicant hereby consents to the Landlord or their agent obtaining and viewing credit, financial and related personal or business information, and Tenant history about the Applicant (including credit reports, credit scores and Tenant records), from past and present Landlords and from the reporting agencies known as Equifax, TransUnion and Landlord Credit Bureau, from time to time for the purposes of assessing the Applicant’s current and ongoing eligibility for tenancy.  The consents provided are effective as of the date of this Application and will be valid for as long as required to fulfill the purposes described herein.</li>
                            <li>Disclosure to Credit Bureaus.  If the Applicant is granted tenancy with the Landlord, the Applicant hereby consents to the Landlord or their agent disclosing personally identifying information about the Applicant and information about their tenancy, including but not limited to the amount and timing of rent payments, good behaviour, problematic behaviour, any debt outstanding, and reviews of the Landlord’s experience regarding the Applicant, to Equifax, TransUnion, Landlord Credit Bureau and other reporting agencies, which may then be used in a Tenant record, credit report and credit score for the Applicant and shared with other Landlords and credit grantors</li>
                        </ul>
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Security Measures</h2>
                    <p>
                        Given the highly sensitive nature of the data collected, including government IDs and financial records, we implement strict physical, organizational, and technological security measures. These safeguards are designed to protect your personal information against loss, theft, unauthorized access, disclosure, copying, or modification.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Applicant Declarations & Consent</h2>
                    <p>
                        By submitting a rental application, you explicitly agree to the following declarations:
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>I, the undersigned, grant permission to contact the personal references listed above, both now and in the future for rental consideration or for collection purposes should they be deemed necessary.</li>
                            <li>I, the undersigned, grant permission to obtain and/or exchange personal or financial information from/with any personal information agency towards verifying or establishing my financial standing.</li>
                            <li>I, the undersigned, acknowledge and understand that personal information will be collected, processed, and stored for the purposes of now and future rental applications or for collections purposes should they be deemed necessary.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Analytics & Cookies</h2>
                    <p>
                        Our website utilizes third-party analytics tools to understand how users interact with our platform and to improve the overall user experience. We use Google Analytics to collect anonymous, statistical data about website traffic. Additionally, we use Microsoft Clarity, which helps us understand user behavior on the site through session recordings, capturing mouse movements, clicks, and scrolling activity. You have the right to accept or decline the use of these tracking cookies through the consent notice displayed upon entering our website.
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-brand-black mt-12 mb-4">Your Rights Under PIPEDA</h2>
                    <p>
                        Under PIPEDA, you maintain specific rights regarding your privacy. You have the right to request access to the personal information we hold about you, request corrections to any inaccurate or outdated information, withdraw your consent for the use of your data, and request the permanent deletion of your data from our systems. To exercise any of these rights, please send an email to our Privacy Officer at <a href="mailto:rent@islandresidential.ca" className="font-bold border-b border-brand-black hover:text-gray-500 transition-colors">rent@islandresidential.ca</a> with the subject line "delete my data" or specify your request clearly in the body of the email. We will respond to your request within a maximum of 30 days.
                    </p>
                </div>
            </main>
        </div>
    );
}
