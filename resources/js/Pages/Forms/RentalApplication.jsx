import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';

export default function RentalApplication({ apartments = [] }) {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
    const { recaptcha } = usePage().props;
    const recaptchaSiteKey = recaptcha?.siteKey ?? '';
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
            sin_number: '',
            declarations_agreed: false,
            terms_agreed: false
        },
        relevant_files: null,
        photo_id: null,
        pet_photo: null,
        captcha_token: ''
    });

    const [activeTab, setActiveTab] = useState(1);
    const [draftSaved, setDraftSaved] = useState(false);
    const [draftSaving, setDraftSaving] = useState(false);

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

    const isTab1Valid = () => {
        const ad = data.application_data;
        if (!data.applicant_email || !data.applicant_phone || !ad.first_name || !ad.last_name || !ad.current_address || !ad.city || !ad.state || !ad.date_of_birth || !ad.occupants_count || !ad.pets || !ad.viewed_property) return false;
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
        
        // Save draft if not already saved
        if (!draftSaved && !draftSaving) {
            setDraftSaving(true);
            try {
                await axios.post(route('forms.rental.draft'), {
                    applicant_name: data.applicant_name,
                    applicant_email: data.applicant_email,
                    applicant_phone: data.applicant_phone,
                    application_data: data.application_data
                });
                setDraftSaved(true);
            } catch (error) {
                console.error("Failed to save draft:", error);
            } finally {
                setDraftSaving(false);
            }
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
                                        <select 
                                            className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" 
                                            value={data.application_data.property_id} 
                                            onChange={e => {
                                                handleDataChange('property_id', e.target.value);
                                                const selectedApt = apartments.find(a => a.id.toString() === e.target.value);
                                                handleDataChange('property_title', selectedApt ? selectedApt.title : '');
                                            }} 
                                            required
                                        >
                                            <option value="">Please Select a Property</option>
                                            {apartments.map(apt => (
                                                <option key={apt.id} value={apt.id}>{apt.title} - {apt.location}</option>
                                            ))}
                                        </select>
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
                                        <button type="button" onClick={handleNextToTab2} disabled={draftSaving} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50">
                                            <span className="relative z-10">{draftSaving ? 'Saving...' : 'Next Step →'}</span>
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
                                        <div>
                                            <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">SIN Number (Optional)</label>
                                            <input type="text" className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors" value={data.application_data.sin_number} onChange={e => handleDataChange('sin_number', e.target.value)} />
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
                                        <div className="text-sm font-light opacity-90 leading-relaxed space-y-4 pb-6 border-b border-gray-700">
                                            <p>I, the undersigned, grant permission to contact the personal references listed above, both now and in the future for rental consideration or for collection purposes should they be deemed necessary.</p>
                                            <p>I, the undersigned, grant permission to obtain and/or exchange personal or financial information from/with any personal information agency towards verifying or establishing my financial standing.</p>
                                            <p>I, the undersigned, acknowledge and understand that personal information will be collected, processed, and stored for the purposes of now and future rental applications or for collections purposes should they be deemed necessary.</p>
                                        </div>
                                        
                                        <label className="flex items-start gap-4 cursor-pointer">
                                            <input type="checkbox" className="mt-1 border-gray-300 text-brand-gray focus:ring-brand-white focus:ring-offset-brand-black rounded" checked={data.application_data.declarations_agreed} onChange={e => handleDataChange('declarations_agreed', e.target.checked)} required />
                                            <div>
                                                <div className="font-bold mb-1 tracking-wider uppercase text-sm">Applicant Declarations & Consent *</div>
                                                <div className="text-sm font-light opacity-90 leading-relaxed">
                                                    I have read, understood, and agree to the declarations above.
                                                </div>
                                            </div>
                                        </label>

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
                                        <button type="submit" disabled={processing || !data.application_data.terms_agreed || !data.application_data.declarations_agreed || (!isLocal && (!recaptchaSiteKey || !data.captcha_token))} className="group relative px-10 py-4 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50">
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
