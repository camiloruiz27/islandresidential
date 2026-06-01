import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Show({ apartment }) {
    const [scrolled, setScrolled] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const images = apartment.images && apartment.images.length > 0 ? apartment.images : [];

    return (
        <div className="min-h-screen bg-brand-white text-brand-black font-sans selection:bg-brand-black selection:text-brand-white">
            <Head title={`${apartment.title} - Island Residential`} />

            {/* Navbar */}
            <nav className={`fixed w-full z-50 transition-all duration-700 ${scrolled ? 'bg-brand-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-8'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
                    <Link href="/" className="animate-fade-in">
                        <img src="/images/media__1779672706531.png" alt="Island Residential" className="h-16 md:h-20 w-auto object-contain" />
                    </Link>
                    <Link href={route('properties.index')} className="group flex items-center text-xs font-bold tracking-[0.2em] animate-fade-in">
                        <span className="transform transition-transform duration-300 group-hover:-translate-x-2 mr-2">←</span>
                        ALL PROPERTIES
                    </Link>
                </div>
            </nav>

            <main className="pt-36 pb-32">

                {/* Hero image gallery */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
                    <div className="relative w-full aspect-[16/7] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-2xl">
                        {images.length > 0 ? (
                            <>
                                <img
                                    src={images[activeImage]}
                                    alt={apartment.title}
                                    className="w-full h-full object-cover transition-opacity duration-700"
                                />
                                {images.length > 1 && (
                                    <div className="absolute bottom-6 right-6 bg-black/70 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-sm tracking-widest">
                                        {activeImage + 1} / {images.length}
                                    </div>
                                )}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black font-bold hover:bg-white transition-all shadow-lg text-lg"
                                        >
                                            &larr;
                                        </button>
                                        <button
                                            onClick={() => setActiveImage(i => (i + 1) % images.length)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-black font-bold hover:bg-white transition-all shadow-lg text-lg"
                                        >
                                            &rarr;
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 tracking-widest uppercase text-sm font-light">
                                No photos available
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-brand-black shadow-md' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main content */}
                <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                    <div className="grid lg:grid-cols-3 gap-16">

                        {/* Left: Details */}
                        <div className="lg:col-span-2">
                            <div className="mb-3">
                                <span className={`text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full ${apartment.status === 'available' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500'}`}>
                                    {apartment.status === 'available' ? '● Available Now' : apartment.status}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-light tracking-tighter mb-4 leading-tight mt-6">
                                {apartment.title}
                            </h1>

                            <p className="text-brand-gray text-sm tracking-widest uppercase font-bold mb-10">
                                {apartment.location || 'Nova Scotia, Canada'}
                            </p>

                            <div className="w-12 h-[2px] bg-brand-black mb-10 rounded-full"></div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-10 mb-14 pb-14 border-b border-gray-100">
                                <div>
                                    <div className="text-3xl font-bold tracking-tighter">{apartment.bedrooms}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Bedrooms</div>
                                </div>
                                <div className="w-px bg-gray-100"></div>
                                <div>
                                    <div className="text-3xl font-bold tracking-tighter">{apartment.bathrooms}</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Bathrooms</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-5">About This Property</h2>
                                <p className="text-gray-600 font-light leading-relaxed text-lg whitespace-pre-line">
                                    {apartment.description}
                                </p>
                            </div>
                        </div>

                        {/* Right: Sticky price card */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <div className="bg-brand-black text-brand-white rounded-[2rem] p-8 shadow-2xl">
                                    <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/40 mb-2">Monthly Rent</div>
                                    <div className="text-4xl font-bold tracking-tighter mb-1">
                                        ${Number(apartment.price).toLocaleString()}
                                    </div>
                                    <div className="text-white/40 text-sm mb-10">per month</div>

                                    <div className="space-y-3 mb-10 pb-10 border-b border-white/10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Bedrooms</span>
                                            <span className="font-bold">{apartment.bedrooms}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Bathrooms</span>
                                            <span className="font-bold">{apartment.bathrooms}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Location</span>
                                            <span className="font-bold text-right max-w-[150px]">{apartment.location || 'Nova Scotia'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Status</span>
                                            <span className="font-bold capitalize">{apartment.status}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Parking</span>
                                            <span className="font-bold">{apartment.has_parking ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Pet friendly</span>
                                            <span className="font-bold">Based on approval</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={route('forms.rental')}
                                        className="block w-full text-center bg-white text-black py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase hover:bg-gray-100 transition-colors mb-3"
                                    >
                                        Apply Now
                                    </Link>
                                    <button
                                        onClick={() => setShowBookingModal(true)}
                                        className="block w-full text-center border border-white/20 text-white/70 py-4 rounded-xl font-bold text-sm tracking-[0.15em] uppercase hover:border-white hover:text-white transition-colors"
                                    >
                                        Book a Viewing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer CTA */}
            <section className="border-t border-gray-100 py-24 text-center px-6">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Interested?</p>
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-8">Ready to make this home yours?</h2>
                <Link
                    href={route('forms.rental')}
                    className="group relative inline-flex items-center justify-center px-12 py-5 bg-brand-black text-brand-white text-xs font-bold uppercase tracking-[0.2em] overflow-hidden rounded-full shadow-lg"
                >
                    <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-10">Apply Now</span>
                    <span className="absolute inset-0 z-10 flex items-center justify-center transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">Get Started &rarr;</span>
                </Link>
            </section>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-brand-black/70 backdrop-blur-md"
                        onClick={() => setShowBookingModal(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up">
                        <button 
                            onClick={() => setShowBookingModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center font-bold hover:bg-gray-200 hover:text-black transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="text-center mb-10 mt-2">
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Book a Viewing</h3>
                            <h4 className="text-3xl font-light tracking-tight">{apartment.title}</h4>
                            <div className="w-8 h-1 bg-brand-black mx-auto mt-6 rounded-full"></div>
                        </div>

                        <div className="space-y-4">
                            <a 
                                href={`sms:+19029791163?&body=${encodeURIComponent("Hello, I am interested in booking a viewing for: " + apartment.title + ". Could you let me know your availability?")}`}
                                className="group flex items-center justify-between w-full p-6 bg-[#007AFF] text-white rounded-3xl hover:bg-[#0066CC] transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-lg mb-1">Send Text Message</div>
                                    <div className="text-blue-100 text-sm font-light">Fastest response via iMessage/SMS</div>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    💬
                                </div>
                            </a>

                            <a 
                                href={`mailto:rent@islandresidential.ca?subject=Viewing Request: ${apartment.title}`}
                                className="group flex items-center justify-between w-full p-6 bg-gray-50 border border-gray-200 text-brand-black rounded-3xl hover:border-black hover:bg-gray-100 transition-colors"
                            >
                                <div className="text-left">
                                    <div className="font-bold text-lg mb-1">Send an Email</div>
                                    <div className="text-gray-500 text-sm font-light">rent@islandresidential.ca</div>
                                </div>
                                <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    ✉️
                                </div>
                            </a>
                        </div>
                        
                        <p className="text-center text-xs text-gray-400 mt-8 font-light">
                            Our team typically responds within a few hours.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
