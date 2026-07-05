import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RentalApplication() {
    const { recaptcha, isProduction } = usePage().props;
    const recaptchaSiteKey = recaptcha?.siteKey ?? '';
    const shouldUseRecaptcha = Boolean(isProduction);
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        application_data: {
            property_id: '',
            property_title: '',
            first_name: '',
            last_name: '',
            current_address: '',
            city: '',
            state: '',
            date_of_birth: '',
            occupants_count: '1',
            pets: '',
            pets_count: '',
            viewed_property: '',
            viewing_availability: '',
            move_in_date: '',
            rented_before: '',
            current_rental_address: '',
            manager_name: '',
            manager_contact: '',
            rental_length: '',
            reason_for_moving: '',
            previous_rental_address: '',
            previous_manager_name: '',
            previous_manager_contact: '',
            previous_rental_length: '',
            vehicles: '',
            employed: '',
            employer_name: '',
            income: '',
            supervisor_name: '',
            supervisor_contact: '',
            current_income_source: '',
            co_applicants: [],
            why_consider_you: '',
            criminal_offense: '',
            bankruptcy_or_consumer_proposal: '',
            terms_agreed: false
        },
        relevant_files: null,
        photo_id: null,
        pet_photo: null,
        captcha_token: ''
    });

    const [activeTab, setActiveTab] = useState(1);
    const errorEntries = Object.entries(errors || {});
    const fieldLabels = {
        applicant_name: 'Applicant Name',
        applicant_email: 'Email Address',
        applicant_phone: 'Cell Phone Number',
        photo_id: 'Photo ID',
        pet_photo: 'Pet Photo',
        relevant_files: 'Relevant Files',
        captcha_token: 'reCAPTCHA',
        'application_data.property_id': 'Property',
        'application_data.property_title': 'Property',
        'application_data.first_name': 'Applicant First Name',
        'application_data.last_name': 'Last Name',
        'application_data.current_address': 'Current Address',
        'application_data.city': 'City',
        'application_data.state': 'Province',
        'application_data.date_of_birth': 'Date of Birth',
        'application_data.occupants_count': 'Total Occupants',
        'application_data.pets': 'Do You Have Pets?',
        'application_data.pets_count': 'How many pets?',
        'application_data.viewed_property': 'Have you already viewed this property?',
        'application_data.viewing_availability': 'Days and times that work for viewing',
        'application_data.rented_before': 'Rented before?',
        'application_data.current_rental_address': 'Current rental address',
        'application_data.manager_name': 'Manager Name',
        'application_data.manager_contact': 'Manager Contact',
        'application_data.rental_length': 'Length of Time',
        'application_data.reason_for_moving': 'Reason for Moving',
        'application_data.previous_rental_address': 'Previous rental address',
        'application_data.previous_manager_name': 'Previous Manager Name',
        'application_data.previous_manager_contact': 'Previous Manager Contact',
        'application_data.previous_rental_length': 'Previous Length of Time',
        'application_data.vehicles': 'Do you have any vehicles?',
        'application_data.employed': 'Currently Employed?',
        'application_data.employer_name': 'Employer Name',
        'application_data.income': 'Income',
        'application_data.supervisor_name': 'Supervisor Name',
        'application_data.supervisor_contact': 'Supervisor Contact',
        'application_data.current_income_source': 'Current source of income',
        'application_data.why_consider_you': 'Tell us about yourself',
        'application_data.criminal_offense': 'Criminal Offense',
        'application_data.bankruptcy_or_consumer_proposal': 'Bankruptcy or consumer proposal',
        'application_data.terms_agreed': 'Terms and Conditions and Privacy Policy',
    };

    const formatErrorLabel = (key) => {
        if (fieldLabels[key]) {
            return fieldLabels[key];
        }

        const coApplicantMatch = key.match(/^application_data\.co_applicants\.(\d+)\.(.+)$/);

        if (coApplicantMatch) {
            const [, index, field] = coApplicantMatch;
            const coApplicantFieldLabels = {
                name: 'First Name',
                last_name: 'Last Name',
                email: 'Email',
                address: 'Current Address',
                date_of_birth: 'Date of Birth',
                employed: 'Currently Employed?',
                employer_name: 'Employer Name',
                income: 'Income',
                supervisor_name: 'Supervisor Name',
                supervisor_contact: 'Supervisor Contact',
                current_income_source: 'Current source of income',
            };

            return `Co-Applicant #${Number(index) + 1} - ${coApplicantFieldLabels[field] ?? field}`;
        }

        return key
            .replace(/^application_data\./, '')
            .replace(/\.\d+\./g, ' ')
            .replace(/\./g, ' ')
            .replace(/_/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const formatErrorMessage = (key, message) => {
        const label = formatErrorLabel(key);
        const normalizedMessage = String(message)
            .replace(/The application data\.[\w.]+ field is required\./i, 'This question is required.')
            .replace(/The [\w.]+ field is required when .*?\./i, 'This question is required.')
            .replace(/The [\w.]+ field is required\./i, 'This question is required.')
            .replace(/Please share your viewing availability\./i, 'Please enter the days and times that work for your viewing.')
            .replace(/The co-applicant email must be a valid email address\./i, 'Please enter a valid email address.')
            .trim();

        return `${label}: ${normalizedMessage}`;
    };

    const handleDataChange = (field, value) => {
        setData('application_data', {
            ...data.application_data,
            [field]: value
        });

        if (field === 'first_name' || field === 'last_name') {
            const first = field === 'first_name' ? value : data.application_data.first_name;
            const last = field === 'last_name' ? value : data.application_data.last_name;
            setData('applicant_name', `${first} ${last}`.trim());
        }
    };

    const handleCoApplicantChange = (index, field, value) => {
        const updatedCoApplicants = [...data.application_data.co_applicants];
        updatedCoApplicants[index] = { ...updatedCoApplicants[index], [field]: value };
        handleDataChange('co_applicants', updatedCoApplicants);
    };

    // Keep co-applicants array in sync with occupants_count
    useEffect(() => {
        const count = parseInt(data.application_data.occupants_count) || 1;
        const extraOccupants = count > 1 ? count - 1 : 0;
        
        let newCoApplicants = [...data.application_data.co_applicants];
        if (newCoApplicants.length < extraOccupants) {
            for (let i = newCoApplicants.length; i < extraOccupants; i++) {
                newCoApplicants.push({ name: '', last_name: '', email: '', address: '', date_of_birth: '', employed: '', employer_name: '', income: '', supervisor_name: '', supervisor_contact: '', current_income_source: '' });
            }
        } else if (newCoApplicants.length > extraOccupants) {
            newCoApplicants = newCoApplicants.slice(0, extraOccupants);
        }

        if (newCoApplicants.length !== data.application_data.co_applicants.length) {
            handleDataChange('co_applicants', newCoApplicants);
        }
    }, [data.application_data.occupants_count]);

    useEffect(() => {
        const errorKeys = Object.keys(errors || {});

        if (errorKeys.length === 0) {
            return;
        }

        if (errorKeys.some(key =>
            key === 'applicant_name' ||
            key === 'applicant_email' ||
            key === 'applicant_phone' ||
            key.startsWith('application_data.property_') ||
            key.startsWith('application_data.first_name') ||
            key.startsWith('application_data.last_name') ||
            key.startsWith('application_data.current_address') ||
            key.startsWith('application_data.city') ||
            key.startsWith('application_data.state') ||
            key.startsWith('application_data.date_of_birth') ||
            key.startsWith('application_data.occupants_count') ||
            key.startsWith('application_data.pets') ||
            key.startsWith('application_data.viewed_property') ||
            key.startsWith('application_data.viewing_availability')
        )) {
            setActiveTab(1);
            return;
        }

        if (errorKeys.some(key =>
            key.startsWith('application_data.rented_before') ||
            key.startsWith('application_data.current_rental_address') ||
            key.startsWith('application_data.manager_name') ||
            key.startsWith('application_data.manager_contact') ||
            key.startsWith('application_data.rental_length') ||
            key.startsWith('application_data.reason_for_moving') ||
            key.startsWith('application_data.previous_') ||
            key.startsWith('application_data.vehicles') ||
            key.startsWith('application_data.employed') ||
            key.startsWith('application_data.employer_name') ||
            key.startsWith('application_data.income') ||
            key.startsWith('application_data.supervisor_name') ||
            key.startsWith('application_data.supervisor_contact') ||
            key.startsWith('application_data.current_income_source') ||
            key.startsWith('application_data.co_applicants')
        )) {
            setActiveTab(2);
            return;
        }

        setActiveTab(3);
    }, [errors]);

    const isTab1Valid = () => {
        const ad = data.application_data;
        if (!ad.property_title || !data.applicant_email || !data.applicant_phone || !ad.first_name || !ad.last_name || !ad.current_address || !ad.city || !ad.state || !ad.date_of_birth || !ad.occupants_count || !ad.pets || !ad.viewed_property) return false;
        if (ad.pets === 'Yes' && !ad.pets_count) return false;
        if (ad.viewed_property === 'No' && !ad.viewing_availability) return false;
        return true;
    };

    const isTab2Valid = () => {
        const ad = data.application_data;
        if (!ad.employed || !ad.rented_before) return false;
        if (ad.employed === 'Yes' && (!ad.employer_name || !ad.income || !ad.supervisor_name || !ad.supervisor_contact)) return false;
        if (ad.employed === 'No' && !ad.current_income_source) return false;
        if (ad.rented_before === 'Yes' && (!ad.current_rental_address || !ad.manager_name || !ad.manager_contact || !ad.rental_length || !ad.reason_for_moving)) return false;
        
        // Check co-applicants
        for (const co of ad.co_applicants) {
            if (!co.name || !co.last_name || !co.email || !co.employed) return false;
            if (co.employed === 'Yes' && (!co.employer_name || !co.income || !co.supervisor_name || !co.supervisor_contact)) return false;
            if (co.employed === 'No' && !co.current_income_source) return false;
        }

        return true;
    };

    const handleNextToTab2 = async () => {
        if (!isTab1Valid()) {
            alert("Please fill all required fields before proceeding.");
            return;
        }

        setActiveTab(2);
    };

    const handleNextToTab3 = () => {
        if (!isTab2Valid()) {
            alert("Please fill all required fields before proceeding.");
            return;
        }
        setActiveTab(3);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.rental.store'), { forceFormData: true });
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
                        {errorEntries.length > 0 && (
                            <div className="mx-8 mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-800">
                                <div className="text-sm font-bold uppercase tracking-[0.15em] mb-3">Please review the following</div>
                                <div className="space-y-2 text-sm">
                                    {errorEntries.map(([key, message]) => (
                                        <p key={key}>{formatErrorMessage(key, message)}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Tabs Header */}
                        <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50">
                            {[1, 2, 3].map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => {
                                        if (tab === 2 && !isTab1Valid()) {
                                            alert("Please complete Part 1 first.");
                                            return;
                                        }
                                        if (tab === 3 && (!isTab1Valid() || !isTab2Valid())) {
                                            alert("Please complete Parts 1 and 2 first.");
                                            return;
                                        }
                                        setActiveTab(tab);
                                    }}
                                    className={`flex-1 px-4 py-6 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab ? 'bg-white border-t-2 border-brand-black text-brand-black shadow-sm' : 'text-gray-400 hover:text-brand-black hover:bg-gray-50'} ${(tab === 2 && !isTab1Valid()) || (tab === 3 && (!isTab1Valid() || !isTab2Valid())) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Property *</label>
                                        <input
                                            type="text"
                                            className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                            value={data.application_data.property_title}
                                            onChange={e => handleDataChange('property_title', e.target.value)}
                                            placeholder="Enter property name"
                                            required
                                        />
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
                                            <input type="text" placeholder="Province" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.state} onChange={e => handleDataChange('state', e.target.value)} required />
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
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Do You Have Pets? *</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.pets} onChange={e => handleDataChange('pets', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {data.application_data.pets === 'Yes' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">How many pets? *</label>
                                                <input type="number" min="1" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.pets_count} onChange={e => handleDataChange('pets_count', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Upload Pet Photo *</label>
                                                <input type="file" accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:font-bold file:tracking-widest file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-3 bg-white" onChange={e => setData('pet_photo', e.target.files[0])} required />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Have you already viewed this property? *</label>
                                        <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.viewed_property} onChange={e => handleDataChange('viewed_property', e.target.value)} required>
                                            <option value="">Please Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    
                                    {data.application_data.viewed_property === 'No' && (
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Please share 3 days and times that work for you to view it *</label>
                                            <textarea className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" rows="3" value={data.application_data.viewing_availability} onChange={e => handleDataChange('viewing_availability', e.target.value)} required></textarea>
                                        </div>
                                    )}
                                    <div className="flex justify-end pt-8 border-t border-gray-100">
                                        <button type="button" onClick={handleNextToTab2} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50">
                                            <span className="relative z-10">Next Step →</span>
                                            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Rental & Employment */}
                            {activeTab === 2 && (
                                <div className="space-y-8 animate-fade-in-up">
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
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Do you have any vehicles?</label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.vehicles} onChange={e => handleDataChange('vehicles', e.target.value)}>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>

                                    {data.application_data.rented_before === 'Yes' && (
                                        <div className="space-y-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <h4 className="font-bold text-lg mb-4">Rental History</h4>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Current rental address *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.current_rental_address} onChange={e => handleDataChange('current_rental_address', e.target.value)} required />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Manager Name *</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.manager_name} onChange={e => handleDataChange('manager_name', e.target.value)} required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Manager Contact *</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.manager_contact} onChange={e => handleDataChange('manager_contact', e.target.value)} required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Length of Time *</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.rental_length} onChange={e => handleDataChange('rental_length', e.target.value)} required />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Reason for Moving *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.reason_for_moving} onChange={e => handleDataChange('reason_for_moving', e.target.value)} required />
                                            </div>
                                            
                                            <div className="pt-4 border-t border-gray-200 mt-4">
                                                <h5 className="font-bold text-md mb-4 text-gray-500">Previous Rental History (Optional)</h5>
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Previous rental address</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.previous_rental_address} onChange={e => handleDataChange('previous_rental_address', e.target.value)} />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Manager Name</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.previous_manager_name} onChange={e => handleDataChange('previous_manager_name', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Manager Contact</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.previous_manager_contact} onChange={e => handleDataChange('previous_manager_contact', e.target.value)} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Length of Time</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.previous_rental_length} onChange={e => handleDataChange('previous_rental_length', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Currently Employed? *</label>
                                        <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.employed} onChange={e => handleDataChange('employed', e.target.value)} required>
                                            <option value="">Please Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                    
                                    {data.application_data.employed === 'Yes' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Employer Name *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.employer_name} onChange={e => handleDataChange('employer_name', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Income *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.income} onChange={e => handleDataChange('income', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Supervisor Name *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.supervisor_name} onChange={e => handleDataChange('supervisor_name', e.target.value)} required />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Supervisor Contact *</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={data.application_data.supervisor_contact} onChange={e => handleDataChange('supervisor_contact', e.target.value)} required />
                                            </div>
                                        </div>
                                    )}

                                    {data.application_data.employed === 'No' && (
                                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">What is your current source of income? *</label>
                                            <textarea className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" rows="3" value={data.application_data.current_income_source} onChange={e => handleDataChange('current_income_source', e.target.value)} required></textarea>
                                        </div>
                                    )}
                                    
                                    {data.application_data.co_applicants.map((coApplicant, index) => (
                                        <div key={index} className="space-y-6 pt-8 border-t border-gray-200 mt-8">
                                            <h3 className="font-bold text-xl mb-4">Co-Applicant #{index + 1}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">First Name *</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.name} onChange={e => handleCoApplicantChange(index, 'name', e.target.value)} required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Last Name *</label>
                                                    <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.last_name} onChange={e => handleCoApplicantChange(index, 'last_name', e.target.value)} required />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Email Address *</label>
                                                    <input type="email" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.email} onChange={e => handleCoApplicantChange(index, 'email', e.target.value)} required />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Date of Birth (Optional)</label>
                                                    <input type="date" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.date_of_birth} onChange={e => handleCoApplicantChange(index, 'date_of_birth', e.target.value)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Current Address (Optional)</label>
                                                <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.address} onChange={e => handleCoApplicantChange(index, 'address', e.target.value)} />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Currently Employed? *</label>
                                                <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={coApplicant.employed} onChange={e => handleCoApplicantChange(index, 'employed', e.target.value)} required>
                                                    <option value="">Please Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>

                                            {coApplicant.employed === 'Yes' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Employer Name *</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={coApplicant.employer_name} onChange={e => handleCoApplicantChange(index, 'employer_name', e.target.value)} required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Income *</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={coApplicant.income} onChange={e => handleCoApplicantChange(index, 'income', e.target.value)} required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Supervisor Name *</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={coApplicant.supervisor_name} onChange={e => handleCoApplicantChange(index, 'supervisor_name', e.target.value)} required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Supervisor Contact *</label>
                                                        <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" value={coApplicant.supervisor_contact} onChange={e => handleCoApplicantChange(index, 'supervisor_contact', e.target.value)} required />
                                                    </div>
                                                </div>
                                            )}

                                            {coApplicant.employed === 'No' && (
                                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">What is your current source of income? *</label>
                                                    <textarea className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors" rows="3" value={coApplicant.current_income_source} onChange={e => handleCoApplicantChange(index, 'current_income_source', e.target.value)} required></textarea>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex justify-between pt-8 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveTab(1)} className="px-8 py-4 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">← Back</button>
                                        <button type="button" onClick={handleNextToTab3} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg">
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
                                        <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Tell us about yourself and why you wish to make this your home *</label>
                                        <textarea className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" rows="3" placeholder="Type here..." value={data.application_data.why_consider_you} onChange={e => handleDataChange('why_consider_you', e.target.value)} required></textarea>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Have you or any of the individuals who will be living in the apartment been charged with a Criminal Offense? * <br/><span className="text-xs font-normal text-gray-500 tracking-normal normal-case">Note: we may require background checks</span></label>
                                            <select className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.criminal_offense} onChange={e => handleDataChange('criminal_offense', e.target.value)} required>
                                                <option value="">Please Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-4 uppercase tracking-wider pl-4">Have you ever filed for bankruptcy or consumer proposal? *</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 cursor-pointer hover:border-brand-black transition-colors">
                                                <input
                                                    type="radio"
                                                    name="bankruptcy_or_consumer_proposal"
                                                    value="Yes"
                                                    checked={data.application_data.bankruptcy_or_consumer_proposal === 'Yes'}
                                                    onChange={e => handleDataChange('bankruptcy_or_consumer_proposal', e.target.value)}
                                                    required
                                                />
                                                <span className="text-sm font-medium text-brand-black">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 cursor-pointer hover:border-brand-black transition-colors">
                                                <input
                                                    type="radio"
                                                    name="bankruptcy_or_consumer_proposal"
                                                    value="No"
                                                    checked={data.application_data.bankruptcy_or_consumer_proposal === 'No'}
                                                    onChange={e => handleDataChange('bankruptcy_or_consumer_proposal', e.target.value)}
                                                    required
                                                />
                                                <span className="text-sm font-medium text-brand-black">No</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-8 border border-gray-100 mt-6 rounded-3xl">
                                        <h4 className="font-bold mb-4 uppercase tracking-[0.1em] text-sm border-b border-gray-200 pb-4">File Uploads</h4>
                                        <p className="text-xs text-gray-500 mb-6 leading-relaxed max-w-xl">Please note viewing priority will be given to applicants who attach all documents from the start.</p>
                                        
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Upload other relevant files</label>
                                            <span className="text-xs text-gray-500 block mb-3">Please note we require a paystub or employment letter and credit score.</span>
                                            <input type="file" multiple className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:font-bold file:tracking-widest file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-4 bg-white" onChange={e => setData('relevant_files', e.target.files)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider">Photo ID *</label>
                                            <input type="file" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:font-bold file:tracking-widest file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-4 bg-white" onChange={e => setData('photo_id', e.target.files[0])} />
                                        </div>
                                    </div>

                                    <div className="bg-brand-black text-brand-white p-8 mt-8 rounded-3xl space-y-6">
                                        <label className="flex items-start gap-4 cursor-pointer">
                                            <input type="checkbox" className="mt-1 border-gray-300 text-brand-gray focus:ring-brand-white focus:ring-offset-brand-black rounded" checked={data.application_data.terms_agreed} onChange={e => handleDataChange('terms_agreed', e.target.checked)} required />
                                            <div>
                                                <div className="font-bold mb-1 tracking-wider uppercase text-sm">Terms and Conditions and Privacy Policy *</div>
                                                <div className="text-sm font-light opacity-90 leading-relaxed" style={{ lineHeight: '1.6', fontSize: '0.875rem' }}>
                                                    By checking this box, I (we), the Applicant(s), explicitly authorize and consent to the Landlord or their agent obtaining and viewing credit, financial, and related personal or business information, as well as tenancy history about the Applicant (including credit reports, credit scores, and tenant records) from past and present Landlords and from credit reporting agencies (such as Equifax, TransUnion, and the Landlord Credit Bureau) from time to time for the purposes of assessing the Applicant’s current and ongoing eligibility for tenancy. The Applicant(s) grant permission to contact the references listed in this application, both now and in the future, for rental consideration. The Applicant(s) acknowledge and understand that personal information will be collected, processed, and stored in accordance with the <a href={route('privacy.policy')} target="_blank" className="underline hover:text-gray-300 transition-colors">Terms and Conditions and Privacy Policy </a> for now and future rental applications or for collections purposes should they be deemed necessary The consents provided are effective as of the date of this Application and will remain valid for as long as required to fulfill the purposes described herein.
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {shouldUseRecaptcha && (
                                        <div className="mt-8 flex flex-col items-center">
                                            {recaptchaSiteKey ? (
                                                <ReCAPTCHA
                                                    sitekey={recaptchaSiteKey}
                                                    onChange={(token) => setData('captcha_token', token || '')}
                                                    onExpired={() => setData('captcha_token', '')}
                                                />
                                            ) : (
                                                <p className="text-red-500 text-xs text-center max-w-md">
                                                    reCAPTCHA is unavailable because the site key is not configured on the server.
                                                </p>
                                            )}
                                            {errors.captcha_token && <p className="text-red-500 text-xs mt-3 text-center">{errors.captcha_token}</p>}
                                        </div>
                                    )}

                                    <div className="flex justify-between pt-8 border-t border-gray-100">
                                        <button type="button" onClick={() => setActiveTab(2)} className="px-8 py-4 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">← Back</button>
                                        <button type="submit" disabled={processing || !data.application_data.terms_agreed || (shouldUseRecaptcha && (!recaptchaSiteKey || !data.captcha_token))} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50">
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
