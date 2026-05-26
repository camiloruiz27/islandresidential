import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RentalApplication() {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        application_data: {
            property_title: '',
            first_name: '',
            last_name: '',
            current_address: '',
            city: '',
            state: '',
            date_of_birth: '',
            occupants_count: '',
            smokers: '',
            move_in_date: '',
            flexible_date: '',
            parking_spaces: '',
            rented_before: '',
            current_rental_address: '',
            reason_for_moving: '',
            additional_rental_history: '',
            vehicles: '',
            employed: '',
            additional_income: '',
            co_applicant_income: '',
            why_consider_you: '',
            criminal_offense: '',
            pets: '',
            terms_agreed: false
        },
        relevant_files: null,
        photo_id: null,
        captcha_token: ''
    });

    const [activeTab, setActiveTab] = useState(1);

    const handleDataChange = (field, value) => {
        setData('application_data', {
            ...data.application_data,
            [field]: value
        });

        // Sync main fields for the database columns
        if (field === 'first_name' || field === 'last_name') {
            const first = field === 'first_name' ? value : data.application_data.first_name;
            const last = field === 'last_name' ? value : data.application_data.last_name;
            setData('applicant_name', `${first} ${last}`.trim());
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.rental.store'));
    };

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans">
            <Head title="Rental Application - Island Residential" />

            <nav className="border-b border-gray-200 py-8 bg-brand-white">
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

            <main className="max-w-4xl mx-auto px-6 py-24">
                <div className="mb-16 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-light tracking-tighter mb-6 leading-tight animate-reveal">
                        Rental <span className="font-bold">Application.</span>
                    </h1>
                    <div className="w-12 h-[2px] bg-brand-black mb-8"></div>
                    <p className="text-lg text-brand-gray font-light">Please fill out the details below to apply for a property. All fields marked with * are required.</p>
                </div>

                {recentlySuccessful ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-10 shadow-sm animate-scale-up rounded-3xl">
                        <h3 className="font-bold text-2xl mb-4 tracking-tight">Application Submitted Successfully!</h3>
                        <p className="font-light text-lg mb-8">Thank you for applying. Our team will review your application and contact you soon.</p>
                        <button onClick={() => window.location.reload()} className="text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-green-800 pb-1 hover:text-green-600 hover:border-green-600 transition-colors">Submit another</button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white border border-gray-100 shadow-2xl animate-fade-in-up opacity-0 rounded-[2.5rem] overflow-hidden" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        
                        {/* Tabs Header */}
                        <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50">
                            {[1, 2, 3].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 px-4 py-6 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab ? 'bg-white border-t-2 border-brand-black text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black hover:bg-gray-50'}`}
                                >
                                    {tab === 1 && '1. Personal & Property Info'}
                                    {tab === 2 && '2. Rental & Employment'}
                                    {tab === 3 && '3. Documents & Agreement'}
                                </button>
                            ))}
                        </div>

                        <div className="p-8 md:p-12">
                            {/* Tab 1: Personal & Property Info */}
                            {activeTab === 1 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Property / Listing Ad Title *</label>
                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.property_title} onChange={e => handleDataChange('property_title', e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Applicant First Name *</label>
                                            <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.first_name} onChange={e => handleDataChange('first_name', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Last Name *</label>
                                            <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.last_name} onChange={e => handleDataChange('last_name', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Cell Phone Number *</label>
                                            <input type="tel" placeholder="(000) 000-0000" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.applicant_phone} onChange={e => setData('applicant_phone', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Email Address *</label>
                                            <input type="email" placeholder="example@example.com" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.applicant_email} onChange={e => setData('applicant_email', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Current Address *</label>
                                        <input type="text" placeholder="Street Address" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors mb-4" value={data.application_data.current_address} onChange={e => handleDataChange('current_address', e.target.value)} required />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="City" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.city} onChange={e => handleDataChange('city', e.target.value)} required />
                                            <input type="text" placeholder="State / Province" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.state} onChange={e => handleDataChange('state', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Date of Birth *</label>
                                            <input type="date" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.date_of_birth} onChange={e => handleDataChange('date_of_birth', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Total Occupants *</label>
                                            <input type="number" min="1" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.occupants_count} onChange={e => handleDataChange('occupants_count', e.target.value)} required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Any Smokers? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.smokers} onChange={e => handleDataChange('smokers', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-8 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveTab(2)} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg">
                                            <span className="relative z-10">Next Step →</span>
                                            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Rental & Employment */}
                            {activeTab === 2 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Desired move in Date</label>
                                            <input type="date" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.move_in_date} onChange={e => handleDataChange('move_in_date', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Is this Date Flexible?</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.flexible_date} onChange={e => handleDataChange('flexible_date', e.target.value)}>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Parking Spaces</label>
                                            <input type="number" min="0" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.parking_spaces} onChange={e => handleDataChange('parking_spaces', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Rented before? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.rented_before} onChange={e => handleDataChange('rented_before', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Current rental address *</label>
                                            <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.current_rental_address} onChange={e => handleDataChange('current_rental_address', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Reason for Moving</label>
                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.reason_for_moving} onChange={e => handleDataChange('reason_for_moving', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Additional Rental History? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.additional_rental_history} onChange={e => handleDataChange('additional_rental_history', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Do you have any Vehicles?</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.vehicles} onChange={e => handleDataChange('vehicles', e.target.value)}>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Currently Employed? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.employed} onChange={e => handleDataChange('employed', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Additional Income?</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.additional_income} onChange={e => handleDataChange('additional_income', e.target.value)}>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Include Co-Applicant's Income? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.co_applicant_income} onChange={e => handleDataChange('co_applicant_income', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-between pt-8 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveTab(1)} className="px-8 py-4 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">← Back</button>
                                        <button type="button" onClick={() => setActiveTab(3)} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg">
                                            <span className="relative z-10">Next Step →</span>
                                            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Documents & Agreement */}
                            {activeTab === 3 && (
                                <div className="space-y-8 animate-fade-in-up">
                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Explain why we should consider you as a future tenant *</label>
                                        <textarea className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" rows="3" placeholder="Type here..." value={data.application_data.why_consider_you} onChange={e => handleDataChange('why_consider_you', e.target.value)} required></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Charged with Criminal Offense? * <br/><span className="text-xs font-normal text-gray-500 tracking-normal normal-case">Note: we may require background checks</span></label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.criminal_offense} onChange={e => handleDataChange('criminal_offense', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Do you have a Pet(s) *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.pets} onChange={e => handleDataChange('pets', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-8 border border-gray-100 mt-6 rounded-3xl">
                                        <h4 className="font-bold mb-4 uppercase tracking-[0.1em] text-sm border-b border-gray-200 pb-4">File Uploads</h4>
                                        <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-xl">Please note viewing priority will be given to applicants who attach all documents from the start.</p>
                                        
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Upload other relevant files</label>
                                            <span className="text-xs text-gray-500 block mb-3">(Attach employment letter, paystub, credit check)</span>
                                            <input type="file" multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:font-bold file:tracking-widest file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-4 bg-white" onChange={e => setData('relevant_files', e.target.files)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider">Photo ID *</label>
                                            <input type="file" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:font-bold file:tracking-widest file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-4 bg-white" onChange={e => setData('photo_id', e.target.files[0])} />
                                        </div>
                                    </div>

                                    <div className="bg-brand-black text-brand-white p-8 mt-8 rounded-3xl">
                                        <label className="flex items-start gap-4 cursor-pointer">
                                            <input type="checkbox" className="mt-1 border-gray-300 text-brand-gray focus:ring-brand-white focus:ring-offset-brand-black rounded" checked={data.application_data.terms_agreed} onChange={e => handleDataChange('terms_agreed', e.target.checked)} required />
                                            <div>
                                                <div className="font-bold mb-1 tracking-wider uppercase text-sm">Privacy Policy *</div>
                                                <div className="text-sm font-light opacity-90 leading-relaxed">
                                                    I have read and accept the <a href={route('privacy.policy')} target="_blank" className="underline hover:text-gray-300 transition-colors">Privacy and Data Handling Policy</a> and verify that the above information is true and accurate to the best of my knowledge.
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {!isLocal && (
                                        <div className="mt-8 flex justify-center">
                                            <ReCAPTCHA
                                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Fallback to Google's test key if env not set
                                                onChange={(token) => setData('captcha_token', token)}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-between pt-8 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveTab(2)} className="px-8 py-4 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">← Back</button>
                                        <button type="submit" disabled={processing || !data.application_data.terms_agreed || (!isLocal && !data.captcha_token)} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50">
                                            <span className="relative z-10">{processing ? 'Submitting...' : 'Submit Application'}</span>
                                            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
