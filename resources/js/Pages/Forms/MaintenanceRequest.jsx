import { Head, Link, useForm } from '@inertiajs/react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function MaintenanceRequest() {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost');
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        user_type: '',
        street_address: '',
        city: '',
        unit: '',
        tenant_name: '',
        tenant_email: '',
        tenant_phone: '',
        issue_description: '',
        photos: null,
        captcha_token: ''
    });

    const submit = (e) => {
        e.preventDefault();
        // Since we have a file upload, Inertia automatically uses FormData
        post(route('forms.maintenance.store'));
    };

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-black selection:text-brand-white">
            <Head title="Maintenance Request - Island Residential" />

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
                        Maintenance <span className="font-bold">Request.</span>
                    </h1>
                    <div className="w-12 h-[3px] bg-brand-black mb-8 rounded-full"></div>
                    <p className="text-lg text-brand-gray font-light">Submit a maintenance request and our team will attend to it shortly. Fields marked with * are required.</p>
                </div>

                {recentlySuccessful ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-10 shadow-sm rounded-3xl animate-scale-up">
                        <h3 className="font-bold text-2xl mb-4 tracking-tight">Request Submitted!</h3>
                        <p className="font-light text-lg mb-8">We have received your maintenance request and will contact you soon.</p>
                        <button onClick={() => window.location.reload()} className="text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-green-800 pb-1 hover:text-green-600 hover:border-green-600 transition-colors">Submit another</button>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white border border-gray-100 shadow-2xl p-8 md:p-12 rounded-[2.5rem] animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Tenant or Homeowner? *</label>
                                <select 
                                    className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                    value={data.user_type} 
                                    onChange={e => setData('user_type', e.target.value)} 
                                    required
                                >
                                    <option value="">Please Select</option>
                                    <option value="Tenant">Tenant</option>
                                    <option value="Homeowner">Homeowner</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Street Address *</label>
                                    <input 
                                        type="text" 
                                        placeholder="E.g. 123 evergreen" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.street_address} 
                                        onChange={e => setData('street_address', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">City *</label>
                                    <input 
                                        type="text" 
                                        placeholder="E.g. Halifax" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.city} 
                                        onChange={e => setData('city', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Unit *</label>
                                    <input 
                                        type="text" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.unit} 
                                        onChange={e => setData('unit', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div>
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Name *</label>
                                    <input 
                                        type="text" 
                                        placeholder="E.g. John Doe" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.tenant_name} 
                                        onChange={e => setData('tenant_name', e.target.value)} 
                                        required 
                                    />
                                    {errors.tenant_name && <p className="text-red-500 text-xs mt-2 pl-4">{errors.tenant_name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Email Address *</label>
                                    <input 
                                        type="email" 
                                        placeholder="E.g. john@doe.com" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.tenant_email} 
                                        onChange={e => setData('tenant_email', e.target.value)} 
                                        required 
                                    />
                                    {errors.tenant_email && <p className="text-red-500 text-xs mt-2 pl-4">{errors.tenant_email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        placeholder="(000) 000-0000" 
                                        className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                        value={data.tenant_phone} 
                                        onChange={e => setData('tenant_phone', e.target.value)} 
                                        required 
                                    />
                                    {errors.tenant_phone && <p className="text-red-500 text-xs mt-2 pl-4">{errors.tenant_phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-3 uppercase tracking-wider pl-4">Details of the service needed or concern *</label>
                                <textarea 
                                    className="w-full border-gray-200 focus:border-brand-black focus:ring-0 p-4 rounded-2xl transition-colors bg-gray-50 hover:bg-gray-100" 
                                    rows="5" 
                                    placeholder="Add the information here..." 
                                    value={data.issue_description} 
                                    onChange={e => setData('issue_description', e.target.value)} 
                                    required
                                ></textarea>
                                {errors.issue_description && <p className="text-red-500 text-xs mt-2 pl-4">{errors.issue_description}</p>}
                            </div>

                            <div className="bg-gray-50 p-8 border border-gray-200 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-brand-light transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 opacity-20"></div>
                                <div className="relative z-10">
                                    <h4 className="font-bold mb-4 uppercase tracking-[0.1em] text-sm border-b border-gray-200 pb-4">Attachments</h4>
                                    <label className="block text-sm font-bold mb-2">Upload photos and/or videos of issue described *</label>
                                    <p className="text-xs text-gray-500 mb-6 font-light leading-relaxed max-w-2xl">Please note photos are mandatory in order to review your request. Drag and Drop (or) Choose Files.</p>
                                    
                                    <input 
                                        type="file" 
                                        multiple
                                        required
                                        className="block w-full text-sm text-gray-500 file:mr-6 file:py-3 file:px-6 file:border-0 file:text-xs file:uppercase file:tracking-widest file:font-bold file:bg-brand-black file:text-white file:rounded-full hover:file:bg-gray-800 transition-colors file:cursor-pointer cursor-pointer border border-dashed border-gray-300 rounded-2xl p-4 bg-white" 
                                        onChange={e => setData('photos', e.target.files)} 
                                    />
                                </div>
                            </div>

                            {!isLocal && (
                                <div className="mt-8 flex justify-center">
                                    <ReCAPTCHA
                                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} // Fallback test key
                                        onChange={(token) => setData('captcha_token', token)}
                                    />
                                </div>
                            )}

                            <div className="pt-8 border-t border-gray-100 flex justify-end mt-8">
                                <button 
                                    type="submit" 
                                    disabled={processing || (!isLocal && !data.captcha_token)} 
                                    className="group relative px-12 py-5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg disabled:opacity-50"
                                >
                                    <span className="relative z-10">{processing ? 'Sending...' : 'Send Message'}</span>
                                    <div className="absolute inset-0 bg-gray-800 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-full"></div>
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}
